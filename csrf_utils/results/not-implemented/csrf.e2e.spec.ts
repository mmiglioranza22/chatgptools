import { Test } from "@nestjs/testing";
import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import cookieParser from "cookie-parser";

import { CsrfGuard } from "../src/csrf.guard";
import { CsrfCookieMiddleware } from "../src/csrf-cookie.middleware";

@Controller()
class TestController {
  @Get("/public")
  getPublic() {
    return { ok: true };
  }

  @UseGuards(CsrfGuard)
  @Post("/protected")
  postProtected() {
    return { success: true };
  }
}

describe("CSRF E2E", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.CSRF_SECRET = "e2e-secret";

    const moduleRef = await Test.createTestingModule({
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.use(new CsrfCookieMiddleware().use);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should set csrf cookie on GET", async () => {
    const res = await request(app.getHttpServer()).get("/public").expect(200);

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.startsWith("csrf="))).toBe(true);
  });

  it("should reject POST without CSRF header", async () => {
    const agent = request.agent(app.getHttpServer());

    await agent.get("/public");

    await agent.post("/protected").expect(403);
  });

  it("should allow POST with valid csrf cookie + header", async () => {
    const agent = request.agent(app.getHttpServer());

    const getRes = await agent.get("/public");

    const csrfCookie = getRes.headers["set-cookie"]
      .find((c) => c.startsWith("csrf="))
      .split(";")[0]
      .split("=")[1];

    await agent
      .post("/protected")
      .set("X-CSRF-Token", csrfCookie)
      .expect(201)
      .expect({ success: true });
  });

  it("should reject POST with mismatched csrf header", async () => {
    const agent = request.agent(app.getHttpServer());

    await agent.get("/public");

    await agent
      .post("/protected")
      .set("X-CSRF-Token", "invalid.token")
      .expect(403);
  });
});

### How I came up with this

During the development of a fully fledge backend application purposed for task management, I needed to solve authentication and authorization. I could have just roll with a readily available solution (Clerk, OAuth, etc), but I actually wanted to understand how the flow worked as I inteded to protect specific routes depending on user roles. I also felt a deep curiosity of how the browser and the server worked together to avoid (or neglect) common security exploits and I wanted to become more knowledgeable in that area, as I really have never worked directly with anything related to web security.

I already had a grasp of JWT token based authentication before and followed a few video tutorials of how to implement it, and later adapted it to my applications needs. In the desire to make it "more secure", I added more features: token rotation (cache storage), token invalidation on request. I came across CSRF attacks while investigating all these, and decided to implement it too. How hard could it be?

TLDR: You should roll your own auth to understand why you shouldn't. [This video by ForrestKnight explains it best](https://youtu.be/VA2RS9WN9us?si=Ekkl1jj2aVU59Kpl). Any way, if you decide to roll your own, this might help.

### Scope

This was a broad task at first as I was not 100% sure what CSRF was and how it should be prevented. Refer to the different models responses (I use this with tons of googling to get a grasp)

### Result

I used the model's responses and adapted them to my own application in NestJS. It eventually became such a big project that I think it could be used to bootstrap any backend application that wants to roll its own auth. [You can check it out here]()

If I have to make a takeaway of all this, is to just use a third-party solution. Chances that login with Google, Github or other company from going down and preventing your users from working in your application are very low. So if auth flows is not something you are particularly interested in or is something that needs to be production-level, don't roll your own. For those who still do, Ben Awad explains how to do this in his [video](https://www.youtube.com/watch?v=CcrgG5MjGOk)

### Use example

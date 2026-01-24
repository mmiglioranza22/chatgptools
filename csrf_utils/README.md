### How I came up with this

During the development of a fully fledge backend application purposed for task management, I needed to solve authentication and authorization. I could have just roll with a readily available solution like OAuth (which I will eventually do), but I actually wanted to understand how the flow worked as I inteded to protect specific routes depending on user roles. I also had a deep curiosity on how the browser and the server prevented (or neglected) common security exploits and I wanted to become more knowledgeable in that area as I really have never worked directly with anything related to web security.

I already had a grasp of JWT token based authentication before and followed a few video tutorials of how to implement it, and later adapted it to my applications needs. In the desire to make it "more secure", I added more features: token rotation (cache storage), token invalidation on request. I came across CSRF attacks while investigating all these, and decided to implement it too. How hard could it be?

TLDR: You should roll your own auth to understand why you shouldn't. [This video by ForrestKnight explains it best](https://youtu.be/VA2RS9WN9us?si=Ekkl1jj2aVU59Kpl). Any way, if you decide to roll your own, this might help.

### Scope

This was a broad task at first as I was not 100% sure what CSRF was and how it should be prevented. Refer to the different [models responses](https://github.com/mmiglioranza22/chatgptools/blob/6d3b7c4ac2efe3439941a474e14a8d0901da0e11/csrf_utils/captures) (I use this with tons of googling to get a grasp).

From this, I reasoned:

- I needed first to understand correctly the problem with CSRF (Investigate first).
- My specific implementation needed to work with NestJS, so the model needed to be aware of this, should there be any caveat involved or readily solution available (`csrf-csrf` package)
- I wanted tests to whatever the model provided to see how all the code worked together, what each part accomplished and whether the model understood the task (Double submit pattern required csrf token to be sent in the request cookie and header)

### Result

I used the model's responses and adapted them to my own application in NestJS. It eventually became a big project that stripped away all the business related code and left with what I think could be used to bootstrap any NestJS backend application that wants to roll its own auth. [You can check it out here]()

I did not used `csrf-csrf` package as I saw that the model's solution was more comprehensive that the way the package managed it. Besides, it also meant that I could avoid spending even more time learning yet another package and could always come back when my solution started to show its shortcomings.

If I have to make a takeaway of all this, is to just use a third-party solution. Chances that login with Google, Github or other company from going down and preventing your users from working in your application are very low. So if auth flows is not something you are particularly interested in or is something that needs to be production-level, don't roll your own. For those who still do, Ben Awad explains how to do this in his [video](https://www.youtube.com/watch?v=CcrgG5MjGOk)

### Use example

[Happy path](https://github.com/mmiglioranza22/chatgptools/blob/main/csrf_utils/captures/happy-path)

[Unhappy path](https://github.com/mmiglioranza22/chatgptools/blob/main/csrf_utils/captures/unhappy-path)

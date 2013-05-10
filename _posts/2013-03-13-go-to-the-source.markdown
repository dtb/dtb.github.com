---
layout: post
title: Go to the source
summary: "It's not enough to read summaries and others' interpretations. Go to the source."
---

# Go to the source

<span class="pubdate">published 13 mar 2013</span>

I recently read [a post][the_post] on Hacker News (HN) from a developer shutting down his
side project of 2 years. This isn't about that developer, but the disappointing responses
to his post got me thinking of a
disturbing kind of anti-intellectualism I see online: the idea that if something isn't
already digested, summarized and posted for free to read online, it's not worth
your time to read it, or the related idea that long-form content like books is obsolete.

In their responses, HN commenters suggested that the founder get a co-founder, who would
help him stick out the startup with greater tenacity, or argued that he should "focus
as much on marketing as on the technical things." To me, what was really lacking from
the founder was a rational growth strategy—a theory about what would make the startup
grow, and a method to test it. If you've read The Lean Startup, you're nodding you're
head right now.

The thing is, even though seemingly everyone in the startup world loves to throw around
buzzwords from that book like MVP and pivot, no one in that thread made any mention of
the simple principle of the lean startup. Before I read the Lean
Startup, I too was a buzzword-thrower. I thought to myself, "ehh, I don't need to read
that, I read HN and all the good blogs! I know all that stuff!" But I didn't know anything.
The real information isn't always summarized in a short blog post, or in the comments section of an
increasingly-wanky news aggregator. The real information is at the source.

This isn't the only time I've had this realization. The other day, I was debugging a
mysterious CSS issue. I had some animations on an element that were supposed to run
when the user clicked a menu, but instead they were running whenever the user
hovered over the button. I read a few StackOverflow questions and some tutorials,
but found no mention of this behavior. Finally, I got fed up; I went to the source.
Barely a page past the table of contents, I found the following
sentence.

>  If an element has a display of ‘none’, updating display to a value other than ‘none’
>  will start all animations applied to the element by the ‘animation-name’ property…

And that explained it. The button only appeared when the user hovered over a related
element, so each time they hovered, the display property changed, and the animations
ran again. The fix was about 3 lines of CSS.

When people read something and summarize it for you, they're trying to get across the
parts that seemed most interesting or important to them. But that idea of importance is
subjective. Learning is path dependent and we all have a different starting point.

Not only that, but once you've done your research, your position has changed.
In fact, you probably don't truly know what's it's like anymore to be where you were before.
When you summarize for someone else like you were, you will inevitably leave
something out.

Don't be satisfied with others' summaries. When you really want to know, go to the source.


[the_post]: https://news.ycombinator.com/item?id=5282143

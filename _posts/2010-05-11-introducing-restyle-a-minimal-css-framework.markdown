---
layout: post
title: "Introducing ReStyle: a Minimal CSS Framework"
permalink: /blog/:year/:month/:day/:title
---


# Introducing ReStyle: a Minimal CSS Framework

<span class="pubdate">published may 11 2010</span>

<p>A CSS reset is a stylesheet that clears out inconsistent default styles across browsers. This gives us as developers greater control over the final look of our pages, and forces us to define our own styles, rather than lazily relying on inconsistent browser defaults. If you're new to the concept of reset stylesheets, <a href="http://sixrevisions.com/">Six Revisions</a> has a <a href="http://sixrevisions.com/css/css-tips/css-tip-1-resetting-your-styles-with-css-reset/">great introduction</a> to the concept, including some examples of the inconsistencies in cross-browser default styling.</p>

<h2>Consistency, but at what cost?</h2>

<p>I've done a lot of work with CSS in recent projects, and I've been pondering CSS resets. I use the popular <a href="http://meyerweb.com/eric/tools/css/reset/">reset stylesheet</a> published by Eric Meyer, because it's small and light, and in the public domain. I'm very happy with it as a reset, but I've been struck by one of the drawbacks of CSS resets: CSS resets give us greater consistency, at the cost of requiring greater work to style a page. </p>

<p>CSS frameworks such as <a href="http://www.blueprintcss.org/">Blueprint</a> and <a href="http://960.gs/">960 Grid System</a> (960.gs) attempt to correct this, but I've found that these encumber my development process so much that it's actually more work to use one than it is to just write CSS from the ground up. Blueprint, for example, defines font faces, colors, and a whole slew of classes, some of which I might want and some I might not. Even worse, the styles are grouped in a way that seems designed to make finding and modifying or deleting them very difficult; some styles are even defined in multiple places. When I've developed with Blueprint, I've spent more time removing extraneous nonsense and reverting its rules than it would take for me to apply a reset and then write my own CSS from the ground up. </p>

<p>960.gs has a different aim than Blueprint. 960.gs is a rapid prototyping tool for layouts, and for that purpose, it is excellent. When I worked on <a href="http://www.giveaweigh.com/">Give-a-Weigh</a> with <a href="http://webdevilaz.com/">Jeremy Lindblom</a> and <a href="http://edgarhassler.com/">Edgar Hassler</a>, we only had a single evening to finish it, and 960.gs proved an invaluable tool for rapidly building up the layout. Since it's a <em>layout</em> tool, and not a <em>style</em> tool, 960.gs defines only <a href="http://github.com/nathansmith/960-Grid-System/blob/master/code/css/uncompressed/text.css">the most basic of styles</a>. This is appropriate for that tool, but there's still a small gap to fill:</p>

<ul>
<li>Using only a reset stylesheet, or a layout-centric tool like 960.gs I end up repeating a large amount of work from one site to the next to get hum-drum basic styles working, and </li>
<li>I tend to forgot to style certain elements (<code>code</code>, <code>abbr</code>, <code>del</code>, sometimes even <code>blockquote</code>).</li>
</ul>

<h2>Introducing ReStyle</h2>

<p>Fed up with this, I decided to create ReStyle: a stylesheet that first <strong>re</strong>sets browser defaults, and then applies sensible default <strong>style</strong>s. This stylesheet serves a similar purpose to the user-agent stylesheet provide by a browser, except that it's consistent across browsers. I had seen <a href="http://devkick.com/lab/tripoli/">Tripoli</a>, and found it to be a great project, but had a few gripes with it:</p>

<ol>
<li>Tripoli disables deprecated HTML elements via CSS. I'm all for standards, but my goal is to apply sensible default styles informed by the principle of least surprise. I believe there's a good conversation to be had about dropping support for these elements, but I don't believe a stylesheet is the appropriate place to have it.</li>
<li>Tripoli also uses browser hacks to achieve greater compatibility with older browsers, which is not a priority for me. I develop sites for IE7 and above, so I can get away with this. Your mileage may vary if you do not have that luxury.</li>
<li>Tripoli applies some of its styles by looking for an element with class <code>content</code>. I wanted to avoid making any stipulations about the nature of your markup, in order to provide sensible defaults everywhere.</li>
</ol>

<h3>About ReStyle</h3>

<p><a href="https://github.com/dtb/Restyle">ReStyle</a> is available on GitHub, and is placed under the BSD license.</p>

<p>In creating ReStyle, I stuck with the reset stylesheet from Eric Meyer. This stylesheet provides a good starting point, though it does have a few issues in Internet Explorer 7 (e.g., header tags remain bolded, address tags are italicized) due to the browser's poor implementation of the <code>inherit</code> value in CSS.</p>

<p>For typography and rhythm, I turned to <a href="http://www.alistapart.com/">A List Apart</a>. In particular, for setting font sizes in a consistent manner, I used the techniques described (and rigorously tested) in <a href="http://www.alistapart.com/articles/howtosizetextincss/">How to Size Text in CSS</a>. In setting margins, I tried to follow <a href="http://www.alistapart.com/articles/settingtypeontheweb/">Setting Type on the Web to a Baseline Grid</a>, at least in principle, allowing text to follow a vertical grid. I also set the <code>font-family</code> of body text to be a sans-serif, simply because I find it to be much more readable and attractive. I also <a href="http://www.undermyhat.org/blog/2009/09/css-font-family-monospace-renders-inconsistently-in-firefox-and-chrome/">fixed the bizarre quirk</a> of Firefox and Chrome that causes them to display monospaced fonts much smaller than their surrounding text.</p>

<p>Beyond those few, I tried to make uncontroversial decisions. Unordered lists are displayed as bulleted lists, ordered as numbered with arabic numerals, <code>&lt;strong&gt;</code> bolds, <code>&lt;em&gt;</code> italicizes, and so on. </p>

<p>I look forward to using ReStyle on future projects, and hope you will do the same. Using Restyle or a similar stylesheet provides all the benefits of using a reset stylesheet, and also provides a good set of default styles that reduces programmer workload. It does so without the cruft and insane design decisions that come along with many CSS frameworks.</p>

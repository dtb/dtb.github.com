
---
layout: post
title: An LCD Sunset Timer in C#, Part 2
permalink: /blog/:year/:month/:day/:title
---


# An LCD Sunset Countdown Timer Using C#, Part 2

<span class="pubdate">published jan 25 2008</span>

Sorry for the long gap between posts, I've recently moved to a new place, and started school again, so things have been hectic. In any case, back to the timer. In <a href="http://davidthomasbernal.com/resume/3/an-lcd-sunset-countdown-timer-using-c-part-1">Part 1</a>, I had investigated the options for the LCD plugin, and settled on <a href="http://lcdsmartie.sourceforge.net/">LCD Smartie</a>. I also implemented the algorithm I would use to calculate the sunset time in C#. The last step was to create the actual plugin, tying all the elements together.

As previously discussed, LCD Smartie supports .Net plugins already. The requirements are that a public class be created with the name as LCDSmartie. This class can have up to 20 methods called <code>funtion1</code>-<code>function20</code>. These functions should take two strings, and return a string. (For more details, you can check out the <a href="http://lcdsmartie.sourceforge.net/plugins.html">instruction page</a> for plugin authors.)

I wanted to be able to test the function which did the actual counting down, so I created a new solution as a console application, and then added a second project as a library that would actually do the countdown. Structuring the solution this way makes it so that both a .dll and an .exe are generated when the project is compiled.

My <code>function1</code> looks like this:

{% highlight c# %}
public string function1(string a, string b)
{
	DateTime sunset = Sunset(DateTime.Now);

	if (DateTime.Compare(sunset, DateTime.Now) < 0)
		sunset = Sunset(new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day + 1));

	//doing this subtraction returns a TimeSpan object, whose ToString method I call
	return (sunset - DateTime.Now).ToString();
}
{% endhighlight %}

The return value of this function is a string representing the amount of time between now and sunset. If the sunset has already happened today (a very depressing turn of events indeed), it counts down till tomorrow's sunset.

After testing my function using the the console application, the final step was to get LCD Smartie to call my <code>function1</code> and send the output to the LCD. In line with the rest of the software's philosophy, this was quite simple. All I had to do was copy the .dll to Smartie's plugin directory, and then go to the configuration screen. The screen has a formidable look, but is quite simple. To get an item to display on a given line, you just enter that function on that line (my LCD has 4 lines, so there are 4 input boxes). The $dll function is used to call a .dll implementing the plugin interface. It takes 4 arguments: the dll name, the function number, and two strings that will be passed to the function. Below is a screenshot of my configuration screen.

<a href="http://davidthomasbernal.com/wp-content/uploads/2008/01/config.png" title="Configuration Screen"></a>
<p style="text-align: center"><a href="http://davidthomasbernal.com/wp-content/uploads/2008/01/config.png" title="Configuration Screen"><img src="http://davidthomasbernal.com/wp-content/uploads/2008/01/config.thumbnail.png" alt="Configuration Screen" /></a></p>
One thing to note on this screen is I use the <a href="http://lcdsmartie.sourceforge.net/BigNumPlugin.html" title="Click for info.">BigNum plugin</a> to display multi-line numbers. The plugin is widely configurable, so I'll refer you to their site for that information. And finally, a screenshot of LCD Smartie's preview window. Unfortunately, I don't have any pics of my actual timer available right now.

<a href="http://davidthomasbernal.com/wp-content/uploads/2008/01/smartie.png" title="Screenshot of LCD Window"></a>
<p style="text-align: center"><a href="http://davidthomasbernal.com/wp-content/uploads/2008/01/smartie.png" title="Screenshot of LCD Window"><img src="http://davidthomasbernal.com/wp-content/uploads/2008/01/smartie.png" alt="Screenshot of LCD Window" /></a></p>
And finally, here is the <a href="http://davidthomasbernal.com/wp-content/uploads/2008/01/smartielcd.cs" title="Code for LCD Smartie plugin.">code for LCD Smartie plugin.</a> This is self-contained enough that I will just release the .cs file, but if you have any trouble configuring the solution or projects, let me know. For more complicated projects in the future, I will release full .slns. This code is in the public domain, but if you happen to do something interesting with it, or find it useful, it would be nice if you let me know.<a href="http://davidthomasbernal.com/wp-content/uploads/2008/01/smartielcd.cs" title="Code for LCD Smartie plugin.">
</a>

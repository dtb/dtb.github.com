---
layout: post
title: An LCD Sunset Timer in C#, Part 1
---

# An LCD Sunset Timer in C#, Part 1

<span class="pubdate">published jan 9 2008</span>

An important tradition between a few people at <a href="http://www.synapsestudios.com">my office</a> is the daily viewing of the sunset. I'm not really sure how exactly, but at some point, it was discovered that from our office parking lot, we have a relatively unhindered view of the beautiful Arizona sunset. Combine this with programmers eager to quit coding for a while, and our lack of windows, and you've got a daily ritual. Well, back in December, I was rooting around in<em> The Box</em>, a box of random computer-y ephemera, when I discovered a <a href="http://www.crystalfontz.com/products/632usb/index.html">Crystalfontz USB LCD</a> leftover from a previous project, just sitting there looking sad and lonely. My coworkers quickly came up with the purpose for this thing: a countdown to sunset. We already had <a href="http://www.ambientdevices.com/cat/orb/orborder.html">The Orb</a> setup to grow redder as sunset approached, but found it sometimes was laggy and often lost its signal in our windowless office.

C# is my language of choice for desktop applications, so I immediately set out to find a way to use it to write the controller software for the LCD. At first, I looked to the Crystalfontz LCD <a href="http://www.crystalfontz.com/software/crystalcontrol/index.html">software</a>, but found the software to be poorly documented, and plugins difficult to write, requiring that a DLL be written, which would be loaded by a Windows service running the in the background. After some time fruitlessly spent searching for help on the Crystalfontz forums, I ended up finding a different program entirely: <a href="http://lcdsmartie.sourceforge.net/">LCD Smartie</a>. LCD Smartie has built-in support for writing plugins in .NET, and simply requires that plugin-authors create a class with the same name as their DLL filename, which implements up to 20 public methods named <code>function1</code>-<code>function20</code>.

Knowing that this would do exactly what I wanted, I moved on to calculating the time of sunset. Fortunately, I'd recently discovered one of those obscure functions that PHP is known for, <a href="http://www.php.net/date_sunset">date_sunset</a>, and more importantly, djwice's <a href="http://www.php.net/manual/en/function.date-sunset.php#47838">comment</a>, containing links to information on the algorithm used by this function. I implemented the following sunset function using the algorithm outlined on <a href="http://williams.best.vwh.net/sunrise_sunset_algorithm.htm">this page</a>.

{% highlight c# %}
public DateTime Sunset(DateTime date)
{
	int dayOfYear = date.DayOfYear;

	double tApprox = dayOfYear + ((18 - LON / 15) / 24);

	double meanAnomaly = (0.9856 * tApprox) - 3.289;

	double sunTrueLon = meanAnomaly + (1.916 * Sin(meanAnomaly)) + (0.020 * Sin(2 * meanAnomaly)) + 282.634;

	if (sunTrueLon > 360) while (sunTrueLon > 360) sunTrueLon -= 360;
	if (sunTrueLon < 0) while (sunTrueLon < 0) sunTrueLon += 360;

	double rightAscension = Atan(0.91764 * Tan(sunTrueLon));

	if (rightAscension > 360) while (rightAscension > 360) rightAscension -= 360;
	if (rightAscension < 0) while (rightAscension < 0) rightAscension += 360;

	rightAscension = rightAscension + 90 * (Math.Floor(sunTrueLon / 90) - Math.Floor(rightAscension / 90));

	rightAscension = rightAscension / 15;

	double sinDec = .39782 * Sin(sunTrueLon);
	double cosDec = Cos(Asin(sinDec));

	double cosHour = (Cos(ZENITH) - sinDec * Sin(LAT)) / (cosDec * Cos(LAT));

	double hour = Acos(cosHour) / 15;

	double time = hour + rightAscension - (0.06571 * tApprox) - 6.622;

	time = time - LON / 15;
	time -= 7;

	while (time < 0) time += 24;
	while (time > 24) time -= 24;

	DateTime sunset = new DateTime(date.Year, date.Month, date.Day, (int)time, (int)((time - (int)time) * 60), 0);

	return sunset;
}
{% endhighlight %}

Since geography is done using degrees, but math is done in radians, I decided to write my own trig functions that handled the conversion for me. I'm sure you all know how to do that ( :p ), but in case you don't, here are cosine and arccosine, from which you should be able to extrapolate to figure out the rest.

{% highlight c# %}
private double Cos(double degrees)
{
	return Math.Cos(Math.PI / 180 * degrees);
}

private double Atan(double x)
{
	return 180 / Math.PI * Math.Atan(x);
}
{% endhighlight %}

Also note that I use the constants LAT (latitude), LON (longitude) and <a href="http://en.wikipedia.org/wiki/Zenith_distance">ZENITH</a>. latitude and longitude are simply the ones corresponding to your location (<a href="http://brainoff.com/geocoder/">lookup here</a>), and the standardised value for the zenith is given in the above algorithm link to be 90° 50', or 90.83333°. After some fiddling, I found that the above code in fact generated the same exact sunset time as the one printed in my local papers. With that done, I moved on to writing the plugin and tweaking the timer to display well on the LCD.
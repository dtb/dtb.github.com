---
layout: post
title: C# Image Processing Performance - Unsafe vs. Safe code, Part I
permalink: /blog/:year/:month/:day/:title
---

# C# Image Processing Performance - Unsafe vs. Safe code, Part I

<span class="pubdate">published mar 13 2008</span>

It's spring break at my school, and my travel plans fell through, so I've taken some time to get back into one of my favorite topics in C#, image processing. If you're not familiar with doing this in C#, I'd highly encourage you to start reading the <a href="http://www.codeproject.com/KB/GDI-plus/csharpgraphicfilters11.aspx">great series of articles</a> on the subject by Code Project user <a href="http://www.codeproject.com/script/Articles/MemberArticles.aspx?amid=6556">Christian Graus</a>. Reading and understanding that first article should get you far enough along to be able to follow this one.

I first became interested in C# image processing when I decided for some reason that I should write a program that would allow me to control a media player (e.g., Winamp) on my computer using a webcam and a laser pointer. This remains, to me, an interesting project, but it was simply too audacious for my skill level (and still is, to be honest, as I am but a beginner). One of the first problems I ran into in my naive approach was that using the <code><a href="http://msdn2.microsoft.com/en-us/library/system.drawing.bitmap.getpixel.aspx">Bitmap.Getpixel</a></code> and <code><a href="msdn2.microsoft.com/en-us/library/system.drawing.bitmap.setpixel.aspx">Bitmap.Setpixel</a></code> methods was ridiculously slow. Some quick googling revealed that what I needed was the magic of unsafe code and pointers. I quickly rewrote my functions, and was on my way.

<h3>A Different Approach</h3>
Recently, however, I discovered that there is a middle ground between unsafe code and the <code>Getpixel</code> and <code>Setpixel</code> methods which does not required the use of the unsafe keyword or pointers. I decided to give this a try to see how it performed, both objectively and subjectively.

The key thing to note here was that the Scan0 property of the <code><a href="http://msdn2.microsoft.com/en-us/library/system.drawing.imaging.bitmapdata.aspx">BitmapData</a> class</code> is an <code>IntPtr</code> and not a pointer. This means that rather than dropping into an <code>unsafe</code> block, we can simply use the overloads of the <code><a href="http://msdn2.microsoft.com/en-us/library/system.runtime.interopservices.marshal.copy.aspx">System.Runtime.InteropServices.Marshal.Copy</a></code> method to copy bytes to and from the location of the image in memory.

To test the performance of this method and the usual unsafe method, I wrote two methods which would each threshold an image. I also created a Windows form with a slider that would allow me to change the threshold value in real time, and watch how quickly the image responded (the subjective part of the test). The reasons I chose thresholding were that it's often one of the first things done to an image during machine processing,  and it's simple to write. Aside from that, we're really only interested in the time consumed by reading and writing the data to the image, which shouldn't be affected by the operations perfomed on the data.

The first method, listed below, uses the IntPtr approach.

{% highlight csharp %}
/*No unsafe keyword!*/
public Image ThresholdMA(float thresh)
{
	Bitmap b = new Bitmap(_image);

	BitmapData bData = b.LockBits(new Rectangle(0, 0, _image.Width, _image.Height), ImageLockMode.ReadWrite, b.PixelFormat);

	/* GetBitsPerPixel just does a switch on the PixelFormat and returns the number */
	byte bitsPerPixel = GetBitsPerPixel(bData.PixelFormat);

	/*the size of the image in bytes */
	int size = bData.Stride * bData.Height;

	/*Allocate buffer for image*/
	byte[] data = new byte[size];

	/*This overload copies data of /size/ into /data/ from location specified (/Scan0/)*/
	System.Runtime.InteropServices.Marshal.Copy(bData.Scan0, data, 0, size);

	for (int i = 0; i < size; i += bitsPerPixel / 8 )
	{
		double magnitude = 1/3d*(data[i] +data[i + 1] +data[i + 2]);
		if (magnitude < thresh)
		{
			data[i] = 0;
			data[i + 1] = 0;
			data[i + 2] = 0;
		}
		else
		{
			data[i] = 255;
			data[i + 1] = 255;
			data[i + 2] = 255;
		}
	}

	/* This override copies the data back into the location specified */
	System.Runtime.InteropServices.Marshal.Copy(data, 0, bData.Scan0, data.Length);

	b.UnlockBits(bData);

	return b;
}
{% endhighlight %}

The second method uses pointers.

{% highlight csharp %}
/*Note unsafe keyword*/
public unsafe Image ThresholdUA(float thresh)
{
	Bitmap b = new Bitmap(_image);

	BitmapData bData = b.LockBits(new Rectangle(0, 0, _image.Width, _image.Height), ImageLockMode.ReadWrite, b.PixelFormat);

	byte bitsPerPixel = GetBitsPerPixel(bData.PixelFormat);

	/*This time we convert the IntPtr to a ptr*/
	byte* scan0 = (byte*)bData.Scan0.ToPointer();

	for (int i = 0; i < bData.Height; ++i)
	{
		for (int j = 0; j < bData.Width; ++j)
		{
			byte* data = scan0 + i * bData.Stride + j * bitsPerPixel / 8;

			double magnitude = 1/3d*(data[0] + data[1] + data[2]);
			/*Just write the data into memory*/
			if (magnitude < thresh)
			{
				data[0] = 0;
				data[1] = 0;
				data[2] = 0;
			}
			else
			{
				data[0] = 255;
				data[1] = 255;
				data[2] = 255;
			}
		}
	}

	b.UnlockBits(bData);

	return b;
}
{% endhighlight %}


That basically covers the code and approach. In Part II (tomorrow, I promise!!), I'll post a full .sln and results of the comparison.

Go read [Part II](/blog/2008/03/14/c-image-processing-performance-unsafe-vs-safe-code-part-ii) for another approach, and the performance data!

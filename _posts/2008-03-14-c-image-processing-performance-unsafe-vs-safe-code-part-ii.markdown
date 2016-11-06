---
layout: post
title: C# Image Processing Performance - Unsafe vs. Safe code, Part II
permalink: /blog/:year/:month/:day/:title
---

#C# Image Processing Performance - Unsafe vs. Safe code, Part II

<span class="pubdate">published mar 14 2008</span>

In <a href="http://davidthomasbernal.com/blog/2008/03/13/c-image-processing-performance-unsafe-vs-safe-code-part-i">Part I of this article</a>, I outlined a method of performing pixel-level operations on an image that required neither unsafe code, nor the use of the <code>GetPixel</code> and <code>SetPixel</code> methods, which are notoriously slow. The one thing I neglected to include was an actual comparison of the <code>IntPtr</code> and pointer methods with the <code>GetPixel\SetPixel</code> methods. As such, I present such a method below. It looks tantalizingly simple, but we'll soon see that it is basically worthless.

{% highlight csharp %}
public Image ThresholdGS(float thresh)
{
	Bitmap b = new Bitmap(_image);

	for (int i = 0; i < b.Height; ++i)
	{
		for (int j = 0; j < b.Width; ++j)
		{
			Color c = b.GetPixel(j, i);

			double magnitude = 1 / 3d * (c.B+c.G+c.R);
			
			if (magnitude < thresh)
			{
				b.SetPixel(j,i,Color.FromArgb(0,0,0));
			}
			else
			{
				b.SetPixel(j,i, Color.FromArgb(255,255,255));
			}
		}
	}

	return b;
}
{% endhighlight %}

<h2>Results</h2>
As outlined in the previous post, I created a form that would allow me to run each threshold method repeatedly to find an average time per threshold operation. The results are given in the table below. For these tests, an arbitrary threshold of 125 was chosen. The image used 24 bits-per-color and had a size of 479 x 700 pixels.

<table>
    <thead>
      <tr>
        <th>Algorithm</th>

        <th>Total Time (ms)</th>

        <th>% Difference</th>
      </tr>
    </thead>

    <tr>
      <td colspan="3" style="border-top:1px solid black; border-bottom:1px solid black">
      <strong>N=10</strong></td>
    </tr>

    <tr>
      <td>unsafe</td>

      <td>194</td>

      <td>0</td>
    </tr>

    <tr>
      <td><code>IntPtr</code></td>

      <td>262</td>

      <td>35%</td>
    </tr>

    <tr>
      <td><code>GetPixel</code></td>

      <td>238,299 (~4 min.)</td>

      <td>122,734%</td>

      <td></td>
    </tr>

    <tr>
      <td colspan="3" style="border-bottom:1px solid black"><strong>N=100</strong></td>
    </tr>

    <tr>
      <td>unsafe</td>

      <td>1951</td>

      <td>0</td>
    </tr>

    <tr>
      <td><code>IntPtr</code></td>

      <td>2361</td>

      <td>21%</td>
    </tr>

    <tr>
      <td colspan="3" style="border-bottom:1px solid black"><strong>N=500</strong></td>
    </tr>

    <tr>
      <td>unsafe</td>

      <td>9783</td>

      <td>0</td>
    </tr>

    <tr>
      <td><code>IntPtr</code></td>

      <td>11,499</td>

      <td>17%</td>
    </tr>
  </table>

The first observation is simple: <code>GetPixel\SetPixel</code> SUCKS! It took longer to do 10 operations using that method than it took to do 500 using either of the other two. We also see that the <code>IntPtr</code> method, while not a terrible alternative (if, for some reason, the use of unsafe code was strictly not allowed) is also moderately slower than the pointer method. 

<h2>Test Program</h2>

I wrote up a simple test program to perform these tests. It also includes a subjective test, wherein one can select the threshold method and then move a slider to set different threshold values to see how quickly the image changes. The subjective test agrees with the results above.

If you poke around in the program a bit, you'll also discover a couple of extras, including some tests of using a square-root-of-squares type method for finding the magnitude of a pixel (applied to thresholding, and grayscaling). There is also a method that allows convolution filters to be applied to the image, though editing the filters is very cumbersome. Expect to see new, more-complete versions this program in the future.

<a href="https://github.com/dtb/CSharp-Image-Processing-Sample">The code is now available on GitHub.</a>

Most of the code from this series is in [Process.cs](https://github.com/dtb/CSharp-Image-Processing-Sample/blob/master/ImageProcessor/Process.cs)



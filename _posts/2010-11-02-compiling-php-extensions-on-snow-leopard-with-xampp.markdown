---
layout: post
title: Compiling PHP extensions on Snow Leopard with XAMPP
summary: Getting weird compiler errors using php on OS X with XAMPP? Read on.
---

# Compiling PHP extensions on Snow Leopard with XAMPP

<span class="pubdate">published nov 2 2010</span>

So, you've decided to compile a PHP extension from PECL for use with your local XAMPP install. You run the simple steps:

    phpize
    ./configure
    make 
    sudo make install

But when you go to check your `phpinfo`, the extension hasn't loaded? First, from the commandline, run PHP, and look for an error like this one (linebreaks added):

    $ php
    PHP Warning: PHP Startup: Unable to load dynamic library '/Applications/XAMPP/xamppfiles/lib/php/php-5.3.1/extensions/no-debug-non-zts-20090626/solr.so' - 
    dlopen(/Applications/XAMPP/xamppfiles/lib/php/php-5.3.1/extensions/no-debug-non-zts-20090626/solr.so, 9): no suitable image found. 
    Did find: /Applications/XAMPP/xamppfiles/lib/php/php-5.3.1/extensions/no-debug-non-zts-20090626/solr.so: mach-o, but wrong architecture in Unknown on line 0

The important parts here are `no suitable image found` and `mach-o, but wrong architecture`. (This example is solr, but it could be anything.) What this means is that it's finding the file, and it's a [mach-o](http://en.wikipedia.org/wiki/Mach-O) file, but it's the wrong architecture. This is because current versions of XAMPP are 32 bit, while Snow Leopard by default will compile things in 64-bit mode. 

The fix is simple: tell the compiler to compile for 32-bit instead. Modify the standard compilation steps slightly:

    phpize
    CFLAGS=-m32 CPPFLAGS=-m32 CCASFLAGS=-m32 ./configure
    make
    sudo make install

## Note 1: multiple PHP installations

Note, in these instructions I've assumed that the `php` in your path is the same one being used by XAMPP. You can check this by doing:

    $ which php

Which should give you something like this:

    /Applications/XAMPP/xamppfiles/bin/php

If instead, you get something like `/usr/bin/php` (this is Apple's PHP), you need to modify your [path variable](http://en.wikipedia.org/wiki/PATH_(variable)). You can change it temporarily for the current terminal session as follows:

    $ PATH="/Applications/XAMPP/xamppfiles/bin:${PATH}"

This only lasts within a given terminal session (basically within a window/tab), so remember to do it each time you need to compile.


## Note 2: developer tools

If there's is no `phpize` at `/Applications/XAMPP/xamppfiles/bin/`, then you need to install the XAMPP developer tools, which you can find from the [XAMPP OS X](http://www.apachefriends.org/en/xampp-macosx.html) page.

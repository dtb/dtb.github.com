---
layout: post
title: Debugging Firefox Extensions the Easy Way
---

# Debugging Firefox Extensions the Easy Way

<span class="pubdate">published 9 apr 2011</span>

While testing a REST API I was working on, I discovered an OAuth bug in the otherwise-excellent [Restclient][restclient] Firefox extension. I knew it would be an easy fix, but the information on how on the internet about how to debug a Firefox extension was geared toward hardcore developers working on something from the ground-up, not the dabbler. I eventually figured out how to do it (and that it was incredibly easy), and  thought I'd share my experience with the world. 	

## Crack the XPI

The first step for me was to go from the XPI to a directory that Firefox would load the files from, that way I could edit the files without packaging them up every step of the way. The [Firefox wiki][getting_started] recommends a way to do this from a directory outside your Firefox extensions directory, but naturally, I could not get those instructions to work. As it turns out, you can just unzip the `.xpi` file into a directory with the same name as the .xpi, delete or rename the .xpi, and firefox will happily load the extension from that directory.

First change into the extensions directory under your Firefox profile. There are [instructions][finding_profile] for this on the Firefox wiki, but on OS X, it was under `~/Application Support/Firefox/profiles/XXXXX.default` (where XXXXX is some unique identifier). On Windows, it was under `%APPDATA%/Mozilla/Firefox/Profiles/XXXXXX.default`. Linux folks can hopefully extrapolate to find theirs, or consult the wiki page.

    $ pwd
     /path/to/firefox/profile/extensions

Under the extensions directory, there should be a few .xpi files. If you have a bunch of extensions, it would probably be hard to find the right one (there is probably a way to do this document on the Firefox wiki somewhere.) In my case, I only have one. Extensions directoies are named after their id in their manifest, so it will either be a GUID (see below) or something in the format of an email address (e.g., `ext@developer.dev`). In the case of RESTClient, the extension uses a GUID, so that's what we'll work with.

    $ ls 
     {ad0d925d-88f8-47f1-85ea-8463569e756e}.xpi

xpi files are just zip files by another name, so lets unpack that baby. The directory name needs to match the id from the extension manifest, so unpack it into a directory of the same name as the xpi itself.

    $ unzip \{ad0d925d-88f8-47f1-85ea-8463569e756e\}.xpi -d \{ad0d925d-88f8-47f1-85ea-8463569e756e\}

Finally, rename the xpi file to something else, so that Firefox will ignore it.

    $ mv \{ad0d925d-88f8-47f1-85ea-8463569e756e\}.xpi old-restclient.xpi

Your directory should now look like this:

    $ ls
	 old-restlcient.xpi  {ad0d925d-88f8-47f1-85ea-8463569e756e}

## Making changes

At this point, you can simply go into the directory you created, and edit the files within to make some changes. In my case, I made a simple javascript change, so I didn't need to worry about XUL, or any of the APIs for interacting with the browser that Firefox provides.

I'm not sure how to tell Firefox to reload the javascript assets from the filesystem. In my case, my changes were simple enough that I just closed the browser and re-opened it after each set of changes. If I was planning to spend more than an hour or so working on an extension, it would be worth it to figure out how to reload assets.

For debugging, I was fine just using print statements. The [RESTClient source][rc-debug] includes a simple logging function that writes to the console (Under Tools->Error Console, or CTRL/CMD+Shift+J).

    mlog : function(text) {
        Components.classes["@mozilla.org/consoleservice;1"]
          .getService(Components.interfaces.nsIConsoleService)
          .logStringMessage("RESTClient: "+text);
    },

Again, if you were planning to do anything but the simplest of changes, it would be worth working out a more sophisticated way of debugging, but we're just trying to fix a bug without doing a lot of Yak shaving.

## Repackage, and contribute back

Once you've fixed your bug, simply zip up the files and change the extension back to xpi. If you're leaving it in your Firefox profile directory, it needs to have the same name as before for Firefox to pick it up. If you're distributing it (be sure to check that the license allows you to do so!), you can give it a descriptive name, and then people can install it by dropping the file onto the Firefox Add-ons page.

If you fixed a bug or added a feature that would be useful to others, you should also file an issue with the original developer and submit a patch. 


[restclient]: https://addons.mozilla.org/en-us/firefox/addon/restclient/
[getting_started]: https://developer.mozilla.org/en/Building_an_Extension
[finding_profile]: http://support.mozilla.com/en-US/kb/Profiles#w_how-do-i-find-my-profile
[rc-debug]: https://github.com/chao/RESTClient/blob/master/content/util.js#L5

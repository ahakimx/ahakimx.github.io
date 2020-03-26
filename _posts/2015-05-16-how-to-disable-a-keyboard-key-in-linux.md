---
categories:
- linux
- keyboard
layout: post
title: How To Disable a Keyboard Key in Linux
date: 2015-05-16 05:01:00 +0000
comments: 'true'

---
Okee.. then  
  
Connect a USB keyboard in there, or get into the machine using ssh.  
  
Open a terminal, and run `xev`. It will show some stuff on screen (too much stuff, but don't worry). You will notice that it will show some more stuff if you move your mouse, as well.

Then, press the key combination you want to disable. The info in the screen will change, and you will have to look for the keycode value.

Run something like this, changing `<value>` for the value you got for the keycode in the last step:

    xmodmap -e 'keycode <value>='

For example, if I want to disable the \~ key ( Shift + \` ), I would have to run:

    xmodmap -e 'keycode 49='

I hope this helps! okee thanks you..

***
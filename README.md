# KaguragamesEventNameRepalcer
  You could get **uncersored** content if you install the English/Chinese patch provided by Kaguragames.
  <br>
  But you will get **censored** one if you install the Japnese patch.

  These Scripts could make the games uncersored while keeping the text in Japanese.

## Steps
  1. Install the game in **English** from steam.
  2. Install the **English** Patch.
  3. Copy the folder www, and rename it as **www_uncersored**.
  4. Change the game into **Japanese** Version.
  5. Install the **Japanese** Patch.
  6. (Optional) Copy the folder www, and rename it as **www_cersored**.
  7. Overwrite **\www\img\pictures** with **\www_uncersored\img\pictures**.
  8. Edit the paths in the first few lines in main.js to **match the paths in your PC**.
     <br>
     (If you ignore step 6, you have to edit path_uncensored to make it same as path_target.)
  9. Run main.js (use [node.js](https://nodejs.org/)).

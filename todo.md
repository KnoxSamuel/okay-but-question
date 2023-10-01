
*** FEATURE REQUIREMENTS ***
-----------------------------
The basic concept for this one is for people to be able to add their own "OK But Why" questions to a growing collection of participant questions that become part of the exhibit. 

It's about encouraging people to notice things we think are default that don't have to be, like "why are there 24 hours in the day?" or "why do we build our cities around streets?". 



//      **Input Screen Directory**

    ** a directory for the “input” screen set up with an html file, a css file, and a primary js file that does the following:
        
        * has structure (divs or a css grid) for a heading, subheading, and input bar
        * takes input in the form of a text bar
        * sends the input to a google spreadsheet


//      **Google Cloud API**

    * Uses google-spreadsheet to communicate the server and Google Sheets.

    ** the spreadsheet manages entries with columns for: **
    ** is it approved? (Y/N, true/false, checkbox or just blank and mark “x”s in it) **
    ** timestamp **
    ** entered question text **



//      **Projection Screen Directory**

    *** pays attention to the google spreadsheet and either:
        * pulls data at regular intervals
        * whenever there’s a change, if possible

    *** populates an array with  
        * every question from the spreadsheet for which the “approved” column is true 

    *** (divs) semitransparent white text objects
        * one for each question inputted AND approved by team
        * that drift slowly around the window *
        
    ** one 100% opaque text object for the most recent or active question – this one stays fixed in the center
        



//      **Data Manipulation with D3**
    
    ** assign animations to the .enter() and .exit() selections such that when a new question is added or an existing line is removed, the corresponding element fades in or out 
    
    * new “active” question should move to the center, becoming 100% opaque * while the old one fades to 50%, and starts drifting with the others

    ** keep track of the most recent addition
    and add an “active-question” css class to its element, making it 100% opacity AND fixed to center of the screen 
    
    ** add a bit of motion to the inactive questions so they drift around (slowly) in the background
    
    ** if no new line has been added in a while (say, 2 minutes?) randomly assign the “active” class to one of the older questions
      * Use JavaScript setTimeout or setInterval to switch active questions.
    
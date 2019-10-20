# Evaluation

In this document, I will evaluate the process which I have taken to finish this challenge describing my overall experience and what I learnt during the process. I also want to talk about the success and failures of the project based on what I had planned to begin with.

## Planning & Design

When I chose to work on the Google Maps challenge my initial thought was to start planning it out visually and then figure out how javascript implementations for the map would best fit in. My two main concerns for this project was to ensure responsiveness and map functionality such as getting the user location and marking it on the map.

Whilst trying to plan things out in my head I realised I didn't know how the Google Maps API worked, therefore, I jumped over to the documentation and code samples read through the overview and gathered references to the documentation I will later need such as docs for Markers, Distance, Direction and geolocation.

Once I knew how the architecture needed to be built on the maps side I used that knowledge to craft up a prototype of how the application should look like using `Sketch` which is a photoshop like application for mac. 

*The prototypes can be seen in the `Design.md` documentation file.*

Finally, I had the designs done and now it was time to move into the javascript backend-ish side of things. My goal for this was to make the code as readable, organised and intuitive as possible which is why I decided to conjure up what I call an `Application Flow & Architecture Diagram` *(can be seen in `Development.md` documentation file)*. This diagram shows the sequential chaining of function calls in the application to give you a visual idea of what order the functions are being called in and what they each do. 

With that, I was able to move on to the development stage knowing what needed to be done as well as why and how.

## Development

The development part was broken down into two parts which were the frontend and the map script. I began with making the front end such as the navigation bar that contained all the toggles to the collapsible menu's. I also created the footer bar which served multiple functions such as being the destination displayer and a notification element.

To meet the bonus goal of having everything be responsive, I made use of Bootstrap 4 which is a responsive library of CSS components that can be used in your code to prevent you from reinventing the wheel.

In between all of this, I added the map and started creating the script (`map.js`) that handles all API related functionality. I can definitely say that there is a lot I have learnt about location services and it's security implications due to many issues that arose during development because of trying to get access to someone's location requires some guidelines to be met or setting to be enabled or disabled.

Thanks to the planning stage and great documentation I can't say I encountered too many problems. However, there was one bug that regarding getting user's locations on Chrome would take really long. With enough browsing through documentation and StackOverflow answers, the problem was due to performance and me not meeting a security guideline that required actionable user gesture from user to request location.

## What I learnt

Whilst making this project I learnt something about planning that I think personally helped me a great amount and that was visualising my code flow and architecture in an annotated diagram. This personally helped and others abstractly understand the order in which my code executed and what functions were being run as well as what they did and how they were triggered.

I also learnt a great deal about Google Maps API enabling me to understand in more details how services like Uber or Lyft customise their map to display data about drivers and get data back.

## Conclusion

To conclude, I think that the project went very well given the time it took to learn everything and apply that knowledge to make a web application using Google Maps API. I learnt a lot from planning that I will definitely make use of in my current and future projects.
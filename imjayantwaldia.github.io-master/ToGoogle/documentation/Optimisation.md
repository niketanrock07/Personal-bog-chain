# Optimisation Plan
> This document highlights some optimisation I have made to the project which originated from reviewing my code and running some tests on my computer.

✅ = Optimisation Implemented

❌ = Optimation Not Implemented

---

✅ Refactor name of `setUserLocation` function to `initialiseUserLocation` to make it clearer what the function does and isn’t confused for `setUserLocationOnMap`.

---

✅ Remove conditional statements in `footerAlert` function to simply remove all error type classes, add the error type class to the footer and then add message. This will will remove the need for so many conditional statements. Example:

       footer.className += type;
       footerMsg.innerHTML = message;

    **To replace:**

        if (type == "error") {
            ...
        } else if (type == "alert") {
            ...
        } else if (type == "normal") {
            ...
        } else {
            ...
        }
    
    This makes the code easier to read and more intutive for anyone reading or potentially maintaining it. In terms of computation this helps speed things by a negligible but nice to have amount (every little counts).

---

✅  Add global variable to store Google’s Destination coordinates and replace the 2 occurrences in the code. This will make code clearer and more readable.

    **This optimisation turn this piece of code:**

        new google.maps.Marker({
            position: {lat: 51.533261, lng: -0.126003},
            map: map
        });
    
    **into this:**

        new google.maps.Marker({
            position: destinationCoordinates,
            map: map
        });

    Which is much more readable and allows for user to knows that `destinationCoordinates` is the position being marked instead of `{lat: 51.533261, lng: -0.126003}`.
    
---

❌ Potentially put the creation of the map object in a seperate function to make map initialisation function clearer. Alternatively, I could remove global reference to `map` variable to clean up global scope and store it in the `initMap` local scope to pass in map object as parameter to functions in order to make it clearer what the function rely on to function.

**[!] *This was not implemented* because it created variable chaining between nested functions and creates a mess making it much harder to track where the map variable is being referenced from.**

---
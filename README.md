Highlights of the test project: 

- I am using Vite as a build tool

- All the selected items are stored in the IndexedDB, I could use local or session storage as well but I wanted the application works as it has a back-end to store the selected items.
      - to implement that, i used the lib : react-indexed-db-hook which is a small lib to use index db faster

- All features has been implemented but if i had more time i would create styled component to make the code much more readable but i think my code is understandable here.

- I choose to use tanstack query to manage the data on top on fetch so it can put in cache the result searched. Here it is not relevant, but if the application become bigger it can be usefull. I could make it without tantstack but as it is not heavy i still decided to use it for prevention.
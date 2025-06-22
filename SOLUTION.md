# SOLUTION

## Estimation

Estimated: 4-6 hours

Spent: 8 hours (I got a blocker about the Price API for a while since it was not listed in the API documentation but when I passed it as a parameter it did work)

## Solution

Key features implemented:
1.First Load Display all Products:

-I used React Query for fetching the products and caching the data.
-I figured I will need to paginate the data and for that I took advantage of the caching feature of React Query, in this way I can fetch the data once and then use the cached data when going back and forth in the pagination. Which means if it will not be making any API calls once the data has been fetched once.
-So I created useProductsQuery hook to fetch the products and cache the data, Dashboard page then takes this data and displays it in the data table.
-I also added a loading state to the data table so that the user can see that the data is loading.

2. Filter sidebar with search tags
   -I used the useSearchParams hook to get the search params from the URL.
   -I created the useDebounce hook to debounce the search params so that the API is not called on every key press.
   -I used URL Params to store the search params in the URL, this way I can use the search params to filter the data in the data table. So dashboard component/Product Collection page is constantly watching the parameters and when they change, the page re-renders.
   -on the rerendering it calls the useProductsQuery hook to fetch the data again with the new search params.
   -Inside the useProductsQuery the queryKey that im using are the parameters, so when the parameters change React Query will detect that the data associated with the old key is stale. it then calls getProducts function again with the new parameters.

2.1 Subscription Filter:
-Same thing I did with the tags filter but without the debounce
-when toggle is on in the subscription filter, the page re-renders and the useProductsQuery hook is called again with subscription = "true" parameter.
-I also made the toggle button to toggle optimistically, which means that the button will change its state before the API call is made. So the user can see the change immediately.
-When the API call is made and the data is fetched, React Query will update the data in the cache.
-When toggle is off when subscription = "false" it will delete the parameter from the URL and the page will re-render. This way the user can see the whole list of products.

2.2 Price Filter:
-I used the useDebounce hook to debounce the price so that the API is not called on every key press same with the tags filter.
-when buttons are pressed it will update the price in the URL and the page will re-render.

3. Pagination:

- I use the \_page and \_limit parameters to paginate the data.
- I used cached data when travering back and forth in the pagination.

Sorting:

- handleSortChange is the function that sets sortBy and sortOrder in the URL and the page will re-render.
- the logic of this sorting revovles on 3 states: ascending, descending and not sorted.
- isSorted is a boolean that identifies if the column can be sorted or not.
- The UI has chevron icons to indicate that the column is sortable.
  -when clicking on a column it will set the sortBy to the column id and the sortOrder to ascending. And arrow button will change to indicate the sorting order. The same thing happens when clicking on the same column again, it will change the sorting order to descending.
  -same thing happens the URL parameter is set to new sortBy and sortOrder params. Read by React Query and invalidates the old data then new data is fetched. Page will re-render and the data table will display the newly sorted data.

Solutions for each feature:

- I called API enpoints

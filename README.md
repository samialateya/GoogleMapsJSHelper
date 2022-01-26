## About GoogleMapsJSHelper
It's a javascript Class which contains utility methods that simplify working with google maps web SDK

Note: i used ES7 Class syntax to build the functionality of this app so you can easily expanded and reuse it
## Features

User has the following features provided

- construct google maps object and draw the map
- grab current user location and point to that location in the map
- allow user to drop a marker and get it's coordinates
- calculate the distance between user's current location and the dropped marker
- street view 


## Installation

clone this repository

```
git clone https://github.com/samialateya/GoogleMapsJSHelper.git
composer install
```

## Google Developer Console Setup
1. login to [google developer console](https://console.developers.google.com/) and create new project
2. go to Dashboard and click enable API and Services
3. find google maps javascript API and click Enable
4. go to credentials page and click Create Credentials > API Key
5. copy the key to use it to access google maps SDK
6. go to index.html line 12. src="https://maps.googleapis.com/maps/api/js?key=your_api_key"

## images
[the map](./images/readme/1.png)
[current location view](./images/readme/2.png)
[street view](./images/readme/3.png)

## Contributing

Thank you for considering contributing to this repo.
Feel free to fork this repo and submit a pull request with your updates.

## Errors and Vulnerabilities

Please open an issue on Github if you discover an error on this repo.
and feel free to contact me by email at [samialateya@hotmail.com](mailto:samialateya@hotmail.com).

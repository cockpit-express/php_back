# SAE WS303D

Project link : https://ws303d.mmi24c16.mmi-troyes.fr/

## Datasets

- Train stations : https://defis.data.gouv.fr/datasets/65d81858179dc96581d981db
- Touristic places : https://defis.data.gouv.fr/datasets/61777ddaa9101d073e5506cd

## Help

Run SASS : `sass --watch src/scss:public/assets/css`  

Variable PHP Xampp  
`export PATH="/Applications/XAMPP/xamppfiles/bin:$PATH"`  
`source ~/.zshrc`  

Regénération auto load
`composer dump-autoload`

## Libraries

`illuminate/database` (Eloquent ORM - from Laravel)
`vlucas/phpdotenv`

## SQL

```sql
CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  postal_code VARCHAR(255) NULL
);

CREATE TABLE places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  type VARCHAR(255),
  label VARCHAR(255) NULL,
  postal_code VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  address TEXT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  region_code VARCHAR(255) NULL,
  departement_code VARCHAR(255) NULL
);
```

## Structure


```
saews303d
├─ bootstrap.php
├─ composer.json
├─ composer.lock
├─ public
│  ├─ .htaccess
│  ├─ assets
│  │  ├─ config
│  │  │  └─ config.json
│  │  ├─ css
│  │  │  ├─ style.css
│  │  │  └─ style.css.map
│  │  ├─ fonts
│  │  ├─ images
│  │  │  ├─ icons
│  │  │  └─ illustrations
│  │  │     ├─ default_place.png
│  │  │     ├─ france_map_flat.svg
│  │  │     └─ rails_landscape_1.png
│  │  └─ js
│  │     ├─ cockpit
│  │     │  ├─ EventsManager.js
│  │     │  ├─ MapManager.js
│  │     │  ├─ PlacesManager.js
│  │     │  └─ StoryManager.js
│  │     ├─ cockpitIndex.js
│  │     ├─ config
│  │     │  └─ loadConfig.js
│  │     ├─ datapage.js
│  │     ├─ script.js
│  │     └─ utils
│  │        └─ basics.js
│  ├─ components
│  │  ├─ footer.php
│  │  └─ navbar.php
│  └─ index.php
└─ src
   ├─ controller
   │  ├─ PlaceController.php
   │  └─ StationController.php
   ├─ core
   │  ├─ Router.php
   │  └─ routes.php
   ├─ model
   │  ├─ Place.php
   │  └─ Station.php
   ├─ pages
   │  ├─ about.php
   │  ├─ api.php
   │  ├─ cockpit.php
   │  └─ data.php
   ├─ repository
   │  ├─ PlaceRepositry.php
   │  └─ StationRepository.php
   └─ scss
      ├─ _about.scss
      ├─ _cockpit.scss
      ├─ _datapage.scss
      ├─ _footer.scss
      ├─ _home.scss
      ├─ _layout.scss
      ├─ _navbar.scss
      ├─ _placesList.scss
      ├─ _stationsMap.scss
      ├─ _storyTransition.scss
      └─ style.scss
```
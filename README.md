# SAE WS303D

## Datasets

- Train stations : https://data.sncf.com/explore/dataset/gares-de-voyageurs/information/?disjunctive.segment_drg
- Touristic places : https://defis.data.gouv.fr/datasets/61777ddaa9101d073e5506cd

## Help

Run SASS : `sass --watch dossierSCSS:dossierCSS`  

Variable PHP Xampp  
`export PATH="/Applications/XAMPP/xamppfiles/bin:$PATH"`  
`source ~/.zshrc`  

Regénération auto load
`composer dump-autoload`

## Libraries

`illuminate/database` (Eloquent ORM)
`vlucas/phpdotenv`

## SQL

```sql
CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  postal_code VARCHAR(255) NOT NULL
);

CREATE TABLE places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  type VARCHAR(255),
  label VARCHAR(255),
  postal_code VARCHAR(255),
  city VARCHAR(255),
  address TEXT,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL
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
│  │  ├─ css
│  │  │  ├─ style.css
│  │  │  └─ style.css.map
│  │  ├─ images
│  │  │  ├─ icons
│  │  │  └─ illustrations
│  │  │     └─ cockpit.svg
│  │  └─ js
│  │     └─ script.js
│  └─ index.php
└─ src
   ├─ controller
   │  └─ StationController.php
   ├─ core
   │  ├─ Router.php
   │  └─ routes.php
   ├─ model
   │  └─ Station.php
   ├─ pages
   │  ├─ cockpit.php
   │  └─ home.php
   ├─ repository
   │  └─ StationRepository.php
   └─ scss
      └─ style.scss
```
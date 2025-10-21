# SAE WS303D

## Help

Run SASS : `sass --watch dossierSCSS:dossierCSS`  

Variable PHP Xampp  
`export PATH="/Applications/XAMPP/xamppfiles/bin:$PATH"`  
`source ~/.zshrc`  

Regénération auto load
`composer dump-autoload`

## Libraries

`illuminate/database` (Eloquent ORM)

## SQL

```sql
CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
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
   ├─ core
   ├─ model
   │  └─ Station.php
   ├─ pages
   │  ├─ cockpit.php
   │  ├─ home.php
   │  └─ layout.php
   ├─ repository
   │  └─ StationRepository.php
   └─ scss
      └─ style.scss
```
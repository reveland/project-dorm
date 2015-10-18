# project-dorm
## Követelményfeltárás
- A felhasználó tudjon választani egyet az elérhető szobák közül. 
- Egy üres szoba kiválasztása után tudjon létrehozni egy lakót név és tulajdonság pontok elosztásával, ezt követően kap maga mellé 3 másik lakót  és lezárhatja a szobafoglalást
- Sikeres szobafoglalás után tevékenységeket oszthat ki a szoba lakóinak, amik hatással vannak az állapotukra(energia, éhség, stb.)
- A felhasználó tudjon további tevékenységeket felvenni
- A felhasználók által felvett új tevékenységeket az operátor tudja elfogadni(elérhetővé tenni a lakóknak)

## endpoints
- GET     /                   főoldal
- GET     /login              bejelentkező oldal
- POST    /login              bejelentkezési adatok felküldése
- GET     /login/registrate   regisztrációs oldal
- POST    /login/registrate   regisztrációs adatok felküldése
- GET     /activities         tevékenység lista
- GET     /activities/add     új tevékenység oldal
- POST    /activities/add     új tevékenység adatainak felküldése
- GET     /room               saját szoba oldal
- POST    /room/:resid:actid  tevékenység kiadása
- GET     /room/list          szoba lista
- GET     /room/new/:roomid   kiválasztott szoba képernyője
- POST    /room/new/:roomid   kiválasztott szoba felküldése a 4 lakóval
- GET     /room/new/resident  új lakó hozzáadása
- POST    /room/new/resident  új lakó adatainak felküldése

## adatmodell

![adatmodell](docs/images/adatmodell.png)

## állapotdiagram

![állapotdiagram](docs/images/allapotdiagram.png)

## komponensdiagram

![komponensdiagram](docs/images/komponensdiagram.png)
import { useTranslate } from '@Shared/translate.js';
const { setBulk } = useTranslate();

setBulk({
    en: {
        'character.select.no.account': 'No account was found, restart your game',
        'character.select.bad.write': 'Failed to update, rejoin the server',
        'character.select.bad.character': 'Character does not exist, rejoin server',
        'character.select.first.invalid': 'First name is invalid',
        'character.select.last.invalid': 'Last name is invalid',
        'character.select.invalid.characters': 'Name uses invalid characters',
        'character.select.username.taken': 'Name is unavailable',
        'character.select.character.not.found': 'Character not found, refreshed characters',
        'character.select.submit': 'Submit',
        'character.select.cancel': 'Cancel',
        'character.select.confirm': 'Confirm',
        'character.select.delete': 'Delete',
        'character.select.spawn': 'Spawn',
        'character.select.create': 'Create Character',
        'character.select.no.appearance': 'No Appearance',
        'character.select.confirm.delete': 'Are you sure you want to delete',
        'character.select.first': 'Name / First Name',
        'character.select.last': 'Last Name',
        'character.select.max.characters.reached': 'Max characters reached',
    },
    hu: {
        "character.select.no.account": "Nem található fiók, indítsd újra a játékot",
        "character.select.bad.write": "Frissítés sikertelen, csatlakozz újra a szerverre",
        "character.select.bad.character": "A karakter nem létezik, csatlakozz újra a szerverre",
        "character.select.first.invalid": "Az keresztnév érvénytelen",
        "character.select.last.invalid": "A vezetéknév érvénytelen",
        "character.select.invalid.characters": "A név érvénytelen karaktereket tartalmaz",
        "character.select.username.taken": "A név már foglalt",
        "character.select.character.not.found": "A karakter nem található, frissítsd a karaktereket",
        "character.select.submit": "Küldés",
        "character.select.cancel": "Mégse",
        "character.select.confirm": "Megerősítés",
        "character.select.delete": "Törlés",
        "character.select.spawn": "Kiválasztás",
        "character.select.create": "Karakter Létrehozása",
        "character.select.no.appearance": "Nincs megjelenés",
        "character.select.confirm.delete": "Biztosan törölni szeretnéd",
        "character.select.first": "Keresztnév",
        "character.select.last": "Vezetéknév",
        "character.select.max.characters.reached": "Elérted a maximális karakterek számát"
    }
    
});

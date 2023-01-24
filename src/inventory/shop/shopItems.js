const UserItem = require("../userItem");

module.exports = {
    0: {
        id: 0,
        name: "Pass Dream Team 30 jours",
        description: `Grade Dream Team pendant une durée de 30 jours.
        
Avantages : 
- Création de sondages
- Salon Dream Team exclusif
- 1 mini-jeu en plus disponible`,
        price: 220,
        /**@param {UserItem} item */
        calcExpire: async (item) => {
            const dreamTeamPlus = await item.user.getItem(1);
            const superDreamTeam = await item.user.getItem(2);
            if (item.quantity>0 && dreamTeamPlus.quantity === 0 && superDreamTeam.quantity === 0) {
                return item.expireDate - Date.now() + (item.quantity-1) * 1000 * 60 * 60 * 24 * 30;
            }
            return 0;
        },
    },
    1: {
        id: 1,
        name: "Pass Dream Team + 30 jours",
        description: `Grade Dream Team pendant une durée de 30 jours.
        
Avantages : 
- Création de sondages
- 1 mini-jeu en plus disponible
- Création de sondages et d'évènements
- Couleur du pseudo personalisable
- Double vote de popularité
- Salon exclu pour les Dream Team et Dream Team +`,
        price: 467,
        /**@param {UserItem} item */
        calcExpire: async (item) => {
            const superDreamTeam = await item.user.getItem(2);
            if (item.quantity>0 && superDreamTeam.quantity === 0) {
                return item.expireDate - Date.now() + (item.quantity-1) * 1000 * 60 * 60 * 24 * 30;
            }
            return 0;
        },
    },
    2: {
        id: 2,
        name: "Pass Super Dream Team 30 jours",
        description: `Grade Dream Team pendant une durée de 30 jours.
        
Avantages : 
- Création de sondages
- 1 mini-jeu en plus disponible
- Création de sondages et d'évènements
- Couleur du pseudo personalisable
- Double vote de popularité
- Renommer son pseudo
- Salon exclu pour les Dream Team, Dream Team + et les Super Dream Team`,
        price: 1182,
        /**@param {UserItem} item */
        calcExpire: async (item) => {
            if (item.quantity>0) {
                return item.expireDate - Date.now() + (item.quantity-1) * 1000 * 60 * 60 * 24 * 30;
            }
            return 0;
        },
    },
};

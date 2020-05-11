import {
    IonCol,
    IonContent, IonFab, IonFabButton, IonGrid, IonIcon,
    IonPage, IonRow
} from '@ionic/react';
import React from 'react';
import { Client } from "boardgame.io/react";
import { Local } from 'boardgame.io/multiplayer';
import TicTacToe from "../game/game";
import Board from "../game/board";
import {arrowBackCircle} from "ionicons/icons";

const TicTacToeApp = Client({
    game: TicTacToe,
    board: Board,
    multiplayer: Local(),
    debug: false
});

const Play = () => {

    return (
        <IonPage>
            <IonContent class="ion-no-padding ion-no-margin">
                <IonFab vertical="top" horizontal="start" slot="fixed">
                    <IonFabButton href="/home">
                        <IonIcon icon={arrowBackCircle} />
                    </IonFabButton>
                </IonFab>
                <IonGrid class="ion-no-padding ion-no-margin">
                    <IonRow class="ion-no-padding ion-no-margin">
                        <IonCol class="ion-no-padding ion-no-margin">
                            <TicTacToeApp playerID="0"/>
                        </IonCol>
                        <IonCol>
                            <TicTacToeApp playerID="1"/>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};
export default Play;


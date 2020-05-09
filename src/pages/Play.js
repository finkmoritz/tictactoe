import {
    IonBackButton,
    IonButtons, IonCol,
    IonContent, IonGrid,
    IonHeader,
    IonPage, IonRow,
    IonTitle,
    IonToolbar, useIonViewDidEnter
} from '@ionic/react';
import React from 'react';
import { Client } from "boardgame.io/react";
import { Local } from 'boardgame.io/multiplayer';
import TicTacToe from "../game/game";
import Board from "../game/board";

const TicTacToeApp = Client({
    game: TicTacToe,
    board: Board,
    multiplayer: Local(),
    debug: true
});

const Play = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home"/>
                    </IonButtons>
                    <IonTitle>Play</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol>
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


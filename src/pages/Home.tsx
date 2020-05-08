import {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React from 'react';
import './Home.css';
import {RouteComponentProps} from "react-router";

const Home: React.FC<RouteComponentProps> = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tic Tac Toe</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-text-center">
          <IonButton color="primary" onClick={() => props.history.push('/play')}>Play</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;

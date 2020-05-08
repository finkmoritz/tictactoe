import {
    IonBadge,
    IonCheckbox,
    IonContent, IonFab, IonFabButton,
    IonHeader, IonIcon,
    IonItem,
    IonLabel,
    IonList, IonNote,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React from 'react';
import './Home.css';
import {add} from "ionicons/icons";
import {RouteComponentProps} from "react-router";

const Home: React.FC<RouteComponentProps> = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          <IonList>
              <IonItem>
                  <IonCheckbox slot="start" />
                  <IonLabel>
                      <h1>Create Idea</h1>
                      <IonNote>Run Idea by Brandy</IonNote>
                  </IonLabel>
                  <IonBadge color="success" slot="end">
                      5 Days
                  </IonBadge>
              </IonItem>
          </IonList>
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => props.history.push('/New')}>
                  <IonIcon icon={add} />
              </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;

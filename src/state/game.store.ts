import { inject } from '@angular/core';
import { forkJoin, pipe, switchMap, tap } from 'rxjs';
import { getState, patchState, signalStore, withMethods, withState, } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { ApiService } from '../api/api.service';
import { swapiToNumberParser } from '../utilities/swapiToNumberParser';
import { GameState } from './game.types';
import { ResourceMessage } from '../api/api.models';

const initialState: GameState = {
  isLoading: false,
  error: null,
  playerOne: null,
  playerTwo: null,
  shipOne: null,
  shipTwo: null,
  history: [],
  gameWinner: null,
};

export const GameStore = signalStore(
  withState<GameState>(initialState),
  withMethods((store, apiService = inject(ApiService)) => ({
    setPlayers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { ...initialState, isLoading: true })),
        switchMap(() => {
          return forkJoin({
            firstRequest: apiService.getRandomPerson(),
            secondRequest: apiService.getRandomPerson(),
          }).pipe(
            tapResponse({
              next: ({ firstRequest, secondRequest }) => {
                if (firstRequest.message !== ResourceMessage.OK || secondRequest.message !== ResourceMessage.OK) {
                  patchState(store, { error: { message: 'Error fetching people with random ids' } });
                }

                const playerOne = {
                  name: firstRequest.result.properties.name,
                  mass: firstRequest.result.properties.mass,
                  height: firstRequest.result.properties.height,
                }

                const playerTwo = {
                  name: secondRequest.result.properties.name,
                  mass: secondRequest.result.properties.mass,
                  height: secondRequest.result.properties.height,
                }

                patchState(store, { playerOne, playerTwo});
              },
              error: () => {
                patchState(store, { error: { message: 'SWAPI Server is not responding api/people' } });
              },
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),

    setShips: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, shipOne: null, shipTwo: null })),
        switchMap(() => {
          return forkJoin({
            firstShipRequest: apiService.getRandomShip(),
            secondShipRequest: apiService.getRandomShip(),
          }).pipe(
            tapResponse({
              next: ({ firstShipRequest, secondShipRequest }) => {
                if (firstShipRequest.message !== ResourceMessage.OK || secondShipRequest.message !== ResourceMessage.OK) {
                  patchState(store, { error: { message: 'Error fetching ships with random ids' } });
                  return;
                }

                const shipOne = {
                  name: firstShipRequest.result.properties.name,
                  crew: firstShipRequest.result.properties.crew,
                }

                const shipTwo = {
                  name: secondShipRequest.result.properties.name,
                  crew: secondShipRequest.result.properties.crew,
                }

                patchState(store, { shipOne, shipTwo, });
              },
              error: () => {
                patchState(store, { error: { message: 'SWAPI Server is not responding api/starships' } });
              },
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),

    setWinner(): void {
      const { playerOne, playerTwo, shipOne, shipTwo} = getState(store);

      if (!playerOne || !playerTwo || !shipOne || !shipTwo) {
        patchState(store, { error: { message: 'Players or ships are missing.' } });
        return;
      }

      const playerOneScore = calculatePlayerScore(playerOne.mass, playerOne.height, shipOne.crew);
      const playerTwoScore = calculatePlayerScore(playerTwo.mass, playerTwo.height, shipTwo.crew);


      if (!playerOneScore || !playerTwoScore) {
        patchState(store, { error: { message: 'Those values cannot be calculated.' } });
        return;
      }

      const winner =
        playerOneScore > playerTwoScore ? playerOne : playerTwo;

      patchState(store, (state) => ({
        gameWinner: winner.name,
        history: [
          ...state.history,
          {
            playerOne: {
              name: playerOne.name,
              score: playerOneScore,
              ship: shipOne.name,
            },
            playerTwo: {
              name: playerTwo.name,
              score: playerTwoScore,
              ship: shipTwo.name,
            },
            winner: winner.name,
          },
        ],
      }));
    }
  }))
);

const calculatePlayerScore = (
  mass: string,
  height: string,
  crew: string
): number | undefined => {
  const parsedMass = swapiToNumberParser(mass);
  const parsedHeight = swapiToNumberParser(height);
  const parsedCrew = swapiToNumberParser(crew);

  if (parsedMass === undefined || parsedHeight === undefined || parsedCrew === undefined) {
    return undefined;
  }

  return parsedMass * parsedHeight + parsedCrew;
};

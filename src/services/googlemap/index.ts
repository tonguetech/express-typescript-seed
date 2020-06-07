import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { GoogleMapsClientWithPromise, createClient } from '@google/maps';
import { YamlConfig } from '../../services/yaml';
import { TYPES } from '../../constants';

export interface LagLngResponse {
    lat?: number,
    lng?: number,
    jsonResponse: JSON
}

@injectable()
export class GoogleMapService {

    private googleApiClient: GoogleMapsClientWithPromise;
    private logger: Logger;

    public constructor(
        @inject(TYPES.Config) config: YamlConfig,
        @inject(TYPES.WinstonLogger) logger: Logger,
    ) {
        this.googleApiClient = createClient({
            key: "<google-api-token>",
            language: 'zh-TW',
            Promise: Promise
        });
        this.logger = logger;
    }

    public async getAddressLatLng(address: string): Promise<LagLngResponse> {
        const response = await this.googleApiClient.geocode({ address }).asPromise();
        if (response.json.results.length >= 1) {
            return <LagLngResponse>{
                lat: response.json.results[0].geometry.location.lat,
                lng: response.json.results[0].geometry.location.lng,
                jsonResponse: JSON.parse(JSON.stringify(response.json))
            }
        } else {
            this.logger.warn(`Google map API does not return a latitude and longitude for the address: ${address}`)
            return <LagLngResponse>{
                jsonResponse: JSON.parse(JSON.stringify(response.json))
            }
        }
    }

}
import { inject, injectable } from 'inversify';
import { Logger } from 'winston';
import { Client, GeocodeRequest } from '@googlemaps/google-maps-services-js';
import { YamlConfig } from '../../services/yaml';
import { TYPES } from '../../../constants';

export interface LagLngResponse {
    lat?: number,
    lng?: number,
    jsonResponse: JSON
}

@injectable()
export class GoogleMapService {

    private googleApiClient: Client;
    private googleApiKey?: string;
    private logger: Logger;

    public constructor(
        @inject(TYPES.WinstonLogger) logger: Logger,
    ) {
        this.googleApiClient = new Client({});
        this.googleApiKey = process.env.GOOGLE_MAPS_API_KEY || undefined;
        this.logger = logger;
    }

    public async getAddressLatLng(address: string): Promise<LagLngResponse> {
        if (!this.googleApiKey) {
            throw new Error("Environment variable GOOGLE_MAPS_API_KEY is not set");
        }

        const params = <GeocodeRequest> {
            params: {
                address,
                components: "country:US",
                key: this.googleApiKey,
            },
        };

        const response = await this.googleApiClient.geocode(params);
        if (response.data.results.length >= 1) {
            return <LagLngResponse>{
                lat: response.data.results[0].geometry.location.lat,
                lng: response.data.results[0].geometry.location.lng,
                jsonResponse: JSON.parse(JSON.stringify(response.data))
            };
        } else {
            this.logger.warn(`Google map API does not return a latitude and longitude for the address: ${address}`);
            return <LagLngResponse>{
                jsonResponse: JSON.parse(JSON.stringify(response.data))
            };
        }
    }

}
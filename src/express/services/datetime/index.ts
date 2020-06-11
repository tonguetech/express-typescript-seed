import _ from 'lodash';
import moment from 'moment';
import { inject, injectable } from 'inversify';

interface DOW {
    0: string,
    1: string,
    2: string,
    3: string,
    4: string,
    5: string,
    6: string,
}

@injectable()
export class DateTimeService {

    private dow: DOW;

    public constructor() {
        this.dow = {
            0: 'sun',
            1: 'mon',
            2: 'tue',
            3: 'wed',
            4: 'thu',
            5: 'fri',
            6: 'sat',
        }
    }

    public getNumOfDays(): number {
        return _.size(this.dow);
    }

    public getDayOfWeekByIdx(idx: number): string {
        return <string>_.get(this.dow, idx);
    }

    public getDayOfWeekByDate(date: moment.Moment): string {
        const idx = date.weekday();
        return <string>_.get(this.dow, idx);
    }

    public getTodayDayOfWeek(): string {
        const idx = moment(new Date()).weekday();
        return <string>_.get(this.dow, idx);
    }

    public getDate(after: number): string {
        return moment().add(after, 'days').format();
    }

    public getTimeIntervals(start: moment.Moment, end: moment.Moment): number {
        const duration = moment.duration(end.diff(start)).asMinutes();
        if (duration >= 0) {
            return duration;
        }
        return moment.duration(end.add(1, 'days').diff(start)).asMinutes();
    }

}
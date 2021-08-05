import React, { useEffect, useState } from 'react';
import Common from '../common/index';
import {IDayProps, IDay, ISedules, IDayCN} from '../types';
import dayjs from 'dayjs';

// scss
import './index.scss';

Day.defaultProps = {
    isWhichHour: "24",
    date: dayjs().startOf('day'),
    name: 'day',
    alldayName: '全天',
    schedules: []
}

let moreTop: number = 0;
export default function Day(props: IDayProps) {
    let alldaySchedulesArr: ISedules[] = [];
    let notAlldaySchedulesArr: ISedules[] = [];
    const {
        name,
        isWhichHour,
        schedules = [],
        date,
        alldayName,
        isEnglish,
        clickSchedule,
        clickBlank,
        dbclickBlank,
        rightMouseClick,
        renderHeaderTemplate,
    }  = props;
    
    const [alldaySchedules, setAlldaySchedules] = useState<ISedules[]>([]);
    const [notAlldaySchedules, setNotAlldaySchedules] = useState<ISedules[]>([]);
    const [isShowMoreSchedules, setIsShowMoreSchedules] = useState<boolean>(false);

    useEffect(() => {
        schedules.forEach((item) => {
            // const crossDay = dayjs.unix(item.end).diff(dayjs.unix(item.start), "day", true);
            if (item.end <= date.startOf("day").unix() || item.start > date.endOf("day").unix()) {
                return;
            }
            if (item.isAllDay) {
                alldaySchedulesArr.push(item);
            }
            else {
                notAlldaySchedulesArr.push(item);
            }
        })
        setAlldaySchedules(alldaySchedulesArr);
        setNotAlldaySchedules(notAlldaySchedulesArr);
    }, [schedules, date])

    const handleClickMore = () => {
        setIsShowMoreSchedules(!isShowMoreSchedules);
    }

    const renderAlldayHeight = () => {
        if (alldaySchedules.length > 3 && !isShowMoreSchedules) { // 全天日程大于3,没展示全部日程时
            return `108px`;
        }
        else if (alldaySchedules.length > 3 && isShowMoreSchedules) { // 全天日程大于3,展示全部日程时
            return `${30 * alldaySchedules.length + 2 *(alldaySchedules.length - 1) + 30}px`;
        }
        else { // 全天日程小于3
            return `${30 * alldaySchedules.length + 2 *(alldaySchedules.length - 1)}px`;
        }
    }

    const handleClickSchedule = (event: React.MouseEvent, schedule: ISedules) => {
        clickSchedule && clickSchedule(event, schedule);
    }

    return (
        <div className="rm-calendar-day">
            <div className="rm-calendar-day-dayname">
                <span className="rm-calendar-day-dayname-area">
                    <span className="rm-calendar-day-date-num">
                        {date.date()}
                    </span>
                    <span className="rm-calendar-day-date-name">
                        {isEnglish ? IDay[date.day()] : IDayCN[date.day()]}
                    </span>
                    {
                        renderHeaderTemplate && renderHeaderTemplate(dayjs())
                    }
                </span>
            </div>
            {
                !!alldaySchedules.length && <div className="rm-calendar-allday" style={{height: renderAlldayHeight()}}>
                    <span className="rm-calendar-allday-text-container">
                        <span className="rm-calendar-allday-text">
                            {alldayName}
                        </span>
                    </span>
                    <span className="rm-calendar-allday-schedules">
                        {
                            alldaySchedules.map((item, index) => {
                                if (index > 2 && !isShowMoreSchedules) return;
                                const top = index * 30 + 2*(index - 1) < 0 ? 1 : index * 30;
                                moreTop = top;
                                const scheduleItemStyle = {
                                    color: item.color,
                                    borderLeft: `2px solid ${item.borderColor}`,
                                    width: 'calc(100%)',
                                    height: '28px',
                                    top: `${top}px`,
                                    backgroundColor: item.bgColor,
                                    ...item.customStyle,
                                }
                                return (
                                    <div className="rm-calendar-schedule-item"
                                        style={scheduleItemStyle}
                                        key={index}
                                        onClick={(e) => handleClickSchedule(e, item)}
                                    >
                                        {item.title}
                                    </div>
                                )
                            })
                        }
                    </span>
                    {
                        alldaySchedules.length > 3 && <div style={{top: `${moreTop + 28}px`}} className="rm-calendar-allday-schedules-num">
                                <span onClick={handleClickMore} className="rm-calendar-allday-schedules-num-text">{isShowMoreSchedules ? '收起' : `还有${alldaySchedules.length - 3}项`}</span>
                            </div>
                    }
                </div>
            }
            <Common
                name={name}
                date={date.startOf('day')} 
                isWhichHour={isWhichHour}
                schedules={notAlldaySchedules}
                clickSchedule={clickSchedule}
                clickBlank={clickBlank}
                dbclickBlank={dbclickBlank}
                rightMouseClick={rightMouseClick}
            />
        </div>
    )
}
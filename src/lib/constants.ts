export const BACKLOG_SUBJECTS = [
    'Probability and Statistics',
    'Linear Algebra',
    'Discrete Mathematical Structures',
]

export const CURRENT_SUBJECTS = [
    'Multivariable Calculus (24EMAB215)',
    'Computer Networks (25ECSC211)',
    'Object Oriented Programming (25ECSC204)',
    'Machine Learning (25ECSC212)',
    'Software Engineering (25ECSC213)',
    'Problem Solving & Analysis (24EHSA202)',
]

export const WEEKLY_TIMETABLE: Record<string, string[]> = {
    MONDAY: [
        '09:00–11:00 Computer Networks',
        '11:30–12:30 Software Engineering',
        '12:30–01:30 OOPS',
        '02:30–03:30 PSA',
    ],
    TUESDAY: [
        '09:00–10:00 CN',
        '10:00–11:00 MVC',
        '11:30–01:30 OOPS',
        '02:30–03:30 Linear Algebra',
    ],
    WEDNESDAY: [
        '09:00–10:00 SE',
        '10:30–01:30 OOPS Lab',
        '02:30–03:30 MVC',
        '03:30–05:30 ML',
    ],
    THURSDAY: [
        '09:00–12:00 CN Lab',
        '12:30–01:30 MVC',
        '02:30–03:30 OOPS',
        '03:30–04:30 Linear Algebra',
    ],
    FRIDAY: [
        '09:00–01:00 Web Tech Lab',
        '02:30–04:30 ML',
    ],
    SATURDAY: [
        '09:00–10:00 SE',
        '10:00–11:00 CN',
        '11:30–01:30 ML Lab',
    ],
    SUNDAY: [],
}

export type BacklogStatus = 'Pending' | 'In Progress' | 'Completed'
export type BacklogPriority = 'Low' | 'Medium' | 'High'

import { curseEnum } from "../../common/enums/curseEnum";
import { facultadEnum } from "../../common/enums/facultadEnum";
import { roleEnum } from "../../common/enums/roleEnum";
import { ScientificDegreeEnum } from "../../common/enums/scientificDegreeEnum";
import { TeachingDegreeEnum } from "../../common/enums/teachingDegreeEnum";

interface SeedUser {
    username: string;
    fullname: string;
    email: string;
    password: string;
    role: string;
    facultad: facultadEnum;
}

interface SeedStudent extends SeedUser {
    academicYear?: number;
    curseType?: curseEnum;
    learningStyle?: string;
    firtsTime?: boolean;
}

interface SeedProfessor extends SeedUser {
    scientificDegree?: ScientificDegreeEnum;
    teachingDegree?: TeachingDegreeEnum;
}

interface SeedSubject {
    subjectName: string;
}

interface SeedData {
    users: SeedUser[];
    professors: SeedProfessor[];
    students: SeedStudent[];
    subjects: SeedSubject[];
}

export const initialData: SeedData = {
    users: [
        {
            username: "coretot",
            fullname: "Coret Osoria Tabares",
            email: "coret@gmail.com",
            password: "admin123A+",
            role: roleEnum.ADMIN,
            facultad: facultadEnum.FACULTAD3
        },
        {
            username: "marianot",
            fullname: "Marian Osoria Tabares",
            email: "marian@gmail.com",
            password: "admin123A+",
            role: roleEnum.ADMIN,
            facultad: facultadEnum.FACULTAD1
        },
        {
            username: "osdelindato",
            fullname: "Osdelinda Tabares Ojito",
            email: "osdelinda@gmail.com",
            password: "admin123A+",
            role: roleEnum.ADMIN,
            facultad: facultadEnum.FACULTAD4
        }
    ],

    students: [
        {
            username: "pepeof",
            fullname: "Pepe Ortega Fuentes",
            email: "pepe@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
            firtsTime: false,
            learningStyle: "50,60,30,20"
        },
        {
            username: "jesusepf",
            fullname: "Jesus Pinares Fuentes",
            email: "jesuse@gmail.com",
            password: "admin123",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO
        },
        {
            username: "sheilavh",
            fullname: "Sheila Viñeda Hernandez",
            email: "sheila@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
        },
        {
            username: "carlamg",
            fullname: "Carla Mirta Gomez",
            email: "carla@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
            firtsTime: false,
            learningStyle: "20,60,30,50"
        },
        {
            username: "richarpl",
            fullname: "Richar Peres Lopez",
            email: "richar@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD4,
            academicYear:1,
            curseType: curseEnum.DIURNO,
            firtsTime: false,
            learningStyle: "35,50,30,20"
        },
        {
            username: "melisarq",
            fullname: "Melisa Reyes Quesada",
            email: "melisa@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
        },
        {
            username: "danielfp",
            fullname: "Daniel Fuentes Peres",
            email: "daniel@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
            firtsTime: false,
            learningStyle: "22,70,30,20"
        },
        {
            username: "alfredomt",
            fullname: "Alfredo Mendez Torres",
            email: "alfredo@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
            firtsTime: false,
            learningStyle: "30,60,30,20"
        },
        {
            username: "mariahp",
            fullname: "Maria Hernandez Pupo",
            email: "maria@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
            firtsTime: false,
            learningStyle: "30,60,30,20"
        },
        {
            username: "amandahp",
            fullname: "Amanda Hernandez Pupo",
            email: "amanda@gmail.com",
            password: "admin123A+",
            role: roleEnum.ESTUDIANTE,
            facultad: facultadEnum.FACULTAD3,
            academicYear:1,
            curseType: curseEnum.DIURNO,
            firtsTime: false,
            learningStyle: "50,60,70,20"
        },
    ],

    professors: [
        {
            username: "norgelt",
            fullname: "Norge Lopez Trujillo",
            email: "norget@gmail.com",
            password: "admin123A+",
            role: roleEnum.PROFESSOR_PRINCIPAL,
            facultad: facultadEnum.FACULTAD1,
            scientificDegree: ScientificDegreeEnum.DrC,
            teachingDegree: TeachingDegreeEnum.ENGINEER
        },
        {
            username: "nelsonpp",
            fullname: "Nelson Peres Peres",
            email: "nelson@gmail.com",
            password: "admin123A+",
            role: roleEnum.PROFESSOR_PRINCIPAL,
            facultad: facultadEnum.FACULTAD2,
            scientificDegree: ScientificDegreeEnum.DrC,
            teachingDegree: TeachingDegreeEnum.ENGINEER
        },
        {
            username: "mirtaat",
            fullname: "Mirta Aguirre Trujillo",
            email: "mirta@gmail.com",
            password: "admin123A+",
            role: roleEnum.PROFESSOR_PRINCIPAL,
            facultad: facultadEnum.FACULTAD3,
            scientificDegree: ScientificDegreeEnum.DrC,
            teachingDegree: TeachingDegreeEnum.ENGINEER
        },
        {
            username: "luispn",
            fullname: "Luis Peres Nipe",
            email: "luis@gmail.com",
            password: "admin123A+",
            role: roleEnum.PROFESSOR_AUXILIAR,
            facultad: facultadEnum.FACULTAD3,
            scientificDegree: ScientificDegreeEnum.MsC,
            teachingDegree: TeachingDegreeEnum.ENGINEER
        },
        {
            username: "taniamv",
            fullname: "Tania Machado Ventura",
            email: "tania@gmail.com",
            password: "admin123A+",
            role: roleEnum.PROFESSOR_AUXILIAR,
            facultad: facultadEnum.FACULTAD3,
            teachingDegree: TeachingDegreeEnum.ENGINEER
        },
        {
            username: "olgamv",
            fullname: "Olga Machado Ventura",
            email: "olga@gmail.com",
            password: "admin123A+",
            role: roleEnum.PROFESSOR_AUXILIAR,
            facultad: facultadEnum.FACULTAD3,
            teachingDegree: TeachingDegreeEnum.ENGINEER
        }
    ],   
    
    subjects: [
        {
            subjectName: "Inteligencia_Artificial"
        },
        {
            subjectName: "Física"
        },
        {
            subjectName: "Estructura_de_Datos"
        }
    ]
}


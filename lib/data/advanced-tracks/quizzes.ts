import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";
import { createAllModuleQuizzes } from "@/lib/data/advanced-tracks/quiz-factory";

export const advancedModuleQuizzes = createAllModuleQuizzes(allAdvancedModules);

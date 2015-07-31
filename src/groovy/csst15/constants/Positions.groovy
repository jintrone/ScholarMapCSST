package csst15.constants

/**
 * Created by Emil Matevosyan
 * Date: 2/16/15.
 */
enum Positions {
    PROFESSOR('Professor'),
    ASSOCIATE_PROFESSOR('Associate Professor'),
    ASSISTANT_PROFESSOR('Assistant Professor'),
    QUELLO_PROFESSOR('Quello Professor'),
    FIXED_TERM('Fixed Term'),
    INSTRUCTOR('Instructor'),
    SR_SPECIALIST('Senior Specialist'),
    PHD_STUDENT('PhD Student'),
    MASTERS_STUDENT('Master\'s Student')

    private final String name;

    Positions(String name) {
        this.name = name
    }

    String getName() {
        return name
    }
}
package csst15.constants

/**
 * Created by Emil Matevosyan
 * Date: 2/16/15.
 */
enum Positions {
    PROFESSOR('Professor'),
    ASSOCIATE_PROFESSOR('Associate Professor'),
    ASSISTANT_PROFESSOR('Assistant Professor'),
    FIXED_TERM('Fixed Term'),
    INSTRUCTOR('Instructor'),
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
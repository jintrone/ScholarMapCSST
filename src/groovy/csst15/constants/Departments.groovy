package csst15.constants

/**
 * Created by Emil Matevosyan
 * Date: 2/16/15.
 */
enum Departments {
    MEDIA('Media & Information'),
    COMM('Communications'),
    ADVERTISING('Advertising & PR'),
    JOURNALISM('Journalism'),
    CSD('CSD')


    private final String title;

    Departments(String title) {
        this.title = title
    }

    String getTitle() {
        return title
    }
}
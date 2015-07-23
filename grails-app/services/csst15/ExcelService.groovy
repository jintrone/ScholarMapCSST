package csst15

import grails.transaction.Transactional
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.xssf.usermodel.XSSFWorkbook

import javax.servlet.http.HttpServletRequest

@Transactional
class ExcelService {
    def userService
    def
    static fieldOrder = ["email", "firstName", "lastName", "degreeInstitution", "degreeYear", "position", "currentInstitution", "schoolOrDepartment"]


    def readExcelData(HttpServletRequest request, String field) {
        def fieldsMap = [:]
        def reqFile = request.getFile("${field}")
        Workbook workbook = new XSSFWorkbook(reqFile?.inputStream)

        Sheet sheet = workbook.getSheetAt(0)
        Iterator<Row> rowIterator = sheet.iterator()

//        loadUserCommand.username = fields?.get(0)
//        loadUserCommand.email = fields?.get(1)
//        loadUserCommand.firstName = fields?.get(2)
//        loadUserCommand.lastName = fields?.get(3)
//        loadUserCommand.degreeInstitution = fields?.get(4)
//        loadUserCommand.degreeYear = fields?.get(5)
//        loadUserCommand.position = fields?.get(6)
//        loadUserCommand.currentInstitution = fields?.get(7)
//        loadUserCommand.schoolOrDepartment = fields?.get(8)

        boolean processedHeaders = false
        while (rowIterator.hasNext()) {

            Row row = rowIterator.next()
            Iterator<Cell> cellIterator = row.iterator()
            def headers = []
            def fieldMap = [:]
            def invalid = false
            cellIterator.eachWithIndex {Cell cell, int i ->

                if (!processedHeaders) {
                    headers << cell.getStringCellValue().trim()

                } else {
                    switch (cell.getCellType()) {
                        case Cell.CELL_TYPE_STRING:

                            fieldMap[headers[i]] = cell.getStringCellValue()
                            break

                        case Cell.CELL_TYPE_NUMERIC:
                            fieldMap[headers[i]] = cell.getNumericCellValue()
                            break
                    }
                }



            }
            processedHeaders = true
            if (!invalid)
                fieldsMap.put(row.rowNum, fieldMap)
        }

        return userService.createUser(fieldsMap)
    }
}

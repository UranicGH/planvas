package planvas.assignment.assignments;

import com.google.common.collect.Lists;
import com.typesafe.config.Config;
import org.joda.time.Instant;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import javax.validation.ValidationException;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.testng.Assert.assertEquals;

/**
 * unit tests on the DefaultAssignmentsService validation
 */
public class DefaultAssignmentsServiceTest {

    private AssignmentsDao assignmentsDao;
    private DefaultAssignmentsService service;
    private Config config;

    @BeforeMethod
    public void setup() {
        assignmentsDao = mock(AssignmentsDao.class);
        config = mock(Config.class);
        service = new DefaultAssignmentsService(assignmentsDao, config);
    }

    @Test
    public void testGetAssignments() {
        int page = 3;
        int pageSize = 5;
        Assignment assignment = new Assignment();
        assignment.setSubject("cs 370");
        List<Assignment> expectedAssignments = Lists.newArrayList(assignment);

        when(assignmentsDao.getAssignments(page, pageSize)).thenReturn(expectedAssignments);

        List<Assignment> actualAssignments = service.getAssignments(page, pageSize);

        assertEquals(actualAssignments, expectedAssignments);

        verify(assignmentsDao).getAssignments(page, pageSize);
    }

    @Test
    public void testGetUpcomingAssignments() {
        Assignment assignment = new Assignment();
        assignment.setSubject("cs 370");
        List<Assignment> expectedAssignments = Lists.newArrayList(assignment);

        when(assignmentsDao.getUpcomingAssignments()).thenReturn(expectedAssignments);

        List<Assignment> actualAssignments = service.getUpcomingAssignments();

        assertEquals(actualAssignments, expectedAssignments);

        verify(assignmentsDao).getUpcomingAssignments();
    }

    @Test
    public void testGetContacts() {
        Assignment todo1 = new Assignment();
        todo1.setSubject("cs 370");
        String subject1 = todo1.getSubject();

        Assignment todo2 = new Assignment();
        todo2.setSubject("cs 370");

        Assignment todo3 = new Assignment();
        todo3.setSubject("cs 371w");
        String subject3 = todo3.getSubject();

        List<String> expectedContacts = Lists.newArrayList(subject1);
        expectedContacts.add(subject3);

        when(assignmentsDao.getContacts()).thenReturn(expectedContacts);

        List<String> actualContacts = service.getContacts();

        assertEquals(actualContacts, expectedContacts);

        verify(assignmentsDao).getContacts();
    }

    @Test
    public void testgetTotalAssignments() {
        int expectedTotal = 52;

        when(assignmentsDao.getTotalAssignments()).thenReturn(expectedTotal);

        int actualTotal = service.getTotalAssignments();

        assertEquals(actualTotal, expectedTotal);

        verify(assignmentsDao).getTotalAssignments();
    }

    @Test
    public void testDeleteAssignments() {
        List<Integer> ids = Lists.newArrayList(1, 2, 3);

        doNothing().when(assignmentsDao).deleteAssignment(anyInt());

        service.deleteAssignments(ids);

        verify(assignmentsDao, times(ids.size())).deleteAssignment(anyInt());
        ids.forEach(id -> {
          verify(assignmentsDao).deleteAssignment(id);
        });
    }

    @Test
    public void testDeletePageAssignments() {
        int page = 2;
        int pageSize = 10;

        List<Integer> ids = Lists.newArrayList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        doNothing().when(assignmentsDao).deleteAssignment(anyInt());

        service.deleteAssignments(ids);

        List<Assignment> actualAssignments = service.getAssignments(page, pageSize);
        List<Assignment> expectedAssignments = Lists.newArrayList();

        assertEquals(actualAssignments, expectedAssignments);

        verify(assignmentsDao, times(ids.size())).deleteAssignment(anyInt());
        ids.forEach(id -> {
            verify(assignmentsDao).deleteAssignment(id);
        });
        verify(assignmentsDao).getAssignments(page, pageSize);
    }

    @Test
    public void testAddingAssignmentWithAllValidFields() throws Exception {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject("Test Subject");
        todo.setDetails("Test Details");

        when(assignmentsDao.createNewAssignment(todo)).thenReturn(123);
        when(config.getInt("assignment.public.subjectMaxLength")).thenReturn(30);
        when(config.getInt("assignment.public.detailsMaxLength")).thenReturn(100);

        Assignment newtodo = service.createNewAssignment(todo);

        assertEquals(newtodo.getId(), 123, "ID should be the one from the DAO");
        assertEquals(newtodo.getDate(), todo.getDate());
        assertEquals(newtodo.getSubject(), todo.getSubject());
        assertEquals(newtodo.getDetails().get(), todo.getDetails().get());

        verify(assignmentsDao).createNewAssignment(todo);
        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddingAssignmentNullSubject() {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject(null);
        todo.setDetails("Test Details");

        service.createNewAssignment(todo);

        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddingAssignmentEmptySubject() {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject("");
        todo.setDetails("Test Details");

        service.createNewAssignment(todo);

        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddingAssignmentRestrictedCharacterSubject() {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject("S3CR3T");
        todo.setDetails("Test Details");

        service.createNewAssignment(todo);

        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddingAssignmentSubjectMaxLength() throws Exception {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject("asdfasdfasdfasdfasdfasdfasdfasdf");
        todo.setDetails("Test Details");

        when(assignmentsDao.createNewAssignment(todo)).thenReturn(123);
        when(config.getInt("assignment.public.subjectMaxLength")).thenReturn(30);
        when(config.getInt("assignment.public.detailsMaxLength")).thenReturn(100);

        Assignment newtodo = service.createNewAssignment(todo);

        assertEquals(newtodo.getId(), 123, "ID should be the one from the DAO");
        assertEquals(newtodo.getDate(), todo.getDate());
        assertEquals(newtodo.getSubject(), todo.getSubject());
        assertEquals(newtodo.getDetails().get(), todo.getDetails().get());

        verify(assignmentsDao).createNewAssignment(todo);
        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddingAssignmentAllWhitespace() {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject("     \t\t\r\n  ");
        todo.setDetails("Test Details");

        service.createNewAssignment(todo);

        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddAssignmentMissingDate() {
        Assignment todo = new Assignment();
        todo.setDate(null);
        todo.setSubject("Test Subject");
        todo.setDetails("Test Details");

        service.createNewAssignment(todo);

        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test
    public void testAddAssignmentMissingDetails() throws Exception {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject("Test Subject");
        todo.setDetails(null);

        when(assignmentsDao.createNewAssignment(todo)).thenReturn(123);
        when(config.getInt("assignment.public.subjectMaxLength")).thenReturn(30);
        when(config.getInt("assignment.public.detailsMaxLength")).thenReturn(100);

        Assignment newtodo = service.createNewAssignment(todo);

        assertEquals(newtodo.getId(), 123, "ID should be the one from the DAO");
        assertEquals(newtodo.getDate(), todo.getDate());
        assertEquals(newtodo.getSubject(), todo.getSubject());
        assertEquals(newtodo.getDetails(), todo.getDetails());

        verify(assignmentsDao).createNewAssignment(todo);
        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddingAssignmentDetailsMaxLength() throws Exception {
        Assignment todo = new Assignment();
        todo.setDate(tomorrow());
        todo.setSubject("Olivia");
        todo.setDetails("iiiiiiiiiiiiiiiiiiii'mmmmmmmmmmmmmm gonna swinggggggggggggggggggggggggggg froooooooooooom the chandelierrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");

        when(assignmentsDao.createNewAssignment(todo)).thenReturn(123);
        when(config.getInt("assignment.public.subjectMaxLength")).thenReturn(30);
        when(config.getInt("assignment.public.detailsMaxLength")).thenReturn(100);

        Assignment newtodo = service.createNewAssignment(todo);

        assertEquals(newtodo.getId(), 123, "ID should be the one from the DAO");
        assertEquals(newtodo.getDate(), todo.getDate());
        assertEquals(newtodo.getSubject(), todo.getSubject());
        assertEquals(newtodo.getDetails().get(), todo.getDetails().get());

        verify(assignmentsDao).createNewAssignment(todo);
        verifyNoMoreInteractions(assignmentsDao);
    }

    @Test(expectedExceptions = ValidationException.class)
    public void testAddAssignmentInThePast() {
        Assignment todo = new Assignment();
        todo.setDate(yesterday());
        todo.setSubject("Test Subject");
        todo.setDetails("Test Details");

        service.createNewAssignment(todo);

        verifyNoMoreInteractions(assignmentsDao);
    }

    private Date tomorrow() {
        return Instant.now().plus(1000 * 60 * 60 * 24).toDate();
    }

    private Date yesterday() {
        return Instant.now().minus(1000 * 60 * 60 * 24).toDate();
    }
}

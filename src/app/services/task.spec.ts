import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task';
import { Task } from '../models/task';

// ---- Test data -------------------------------------------------
const mockTasks: Task[] = [
  { id: '1', title: 'Learn Vitest', status: 'pending', description: 'Learn how to write unit tests with Vitest', priority: 'high', dueDate: '2024-07-01', tags: ['testing', 'vitest'] },
  { id: '2', title: 'Test signals', status: 'completed', description: 'Write tests for Angular signals', priority: 'medium', dueDate: '2024-07-02', tags: ['angular', 'signals'] },
];

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  // The base URL your service calls — adjust to match your Azure Function endpoint
  const API_URL = 'https://task-manager-pro.azurewebsites.net/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting(), // swaps the real HttpClient backend for a mock
      ],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Fails the test if there are unmatched/unexpected requests left over
    httpMock.verify();
  });

  // ---- 1. Mocking a GET call + asserting a signal updates ------
  it('should load tasks and update the tasks signal', () => {
    // Before the call resolves, the signal should still be at its initial value
    expect(service.tasks()).toEqual([]);

    service.getTasks();

    // Intercept the outgoing request instead of hitting the real API
    const req = httpMock.expectOne(API_URL+'/getTasks');
    expect(req.request.method).toBe('GET');

    // Manually resolve it with fake data
    req.flush(mockTasks);

    // Signals update synchronously once flush() resolves the request
    expect(service.tasks()).toEqual(mockTasks);
    expect(service.tasks().length).toBe(2);
  });

  // ---- 2. Mocking a POST call (create) --------------------------
  it('should create a task and add it to the tasks signal', () => {
    // Seed the signal as if getTasks() already ran
    service.tasks.set([mockTasks[0]]);

    const newTask: Task = { id: '3', title: 'Ship the app', status: 'progress', description: 'Deploy the app to production', priority: 'high', dueDate: '2024-07-03', tags: ['deployment'] };

    service.createTask(newTask).subscribe();

    const req = httpMock.expectOne(API_URL + '/createTasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush(newTask);

    expect(service.tasks().length).toBe(2);
    expect(service.tasks()).toContainEqual(newTask);
  });

  // ---- 3. Mocking a PUT call (update) ---------------------------
  it('should update a task in place', () => {
    service.tasks.set([...mockTasks]);

    const updated: Task = { ...mockTasks[0], status: 'completed' };

    service.updateTask(updated).subscribe();
    const req = httpMock.expectOne(`${API_URL}/updateTasks/${updated.id}`);
    expect(req.request.method).toBe('PUT');

    req.flush(updated);

    const result = service.tasks().find((t) => t.id === updated.id);
    expect(result?.status).toBe('completed');
  });

  // ---- 4. Mocking a DELETE call ----------------------------------
  it('should remove a task from the tasks signal', () => {
    service.tasks.set([...mockTasks]);

    service.deleteTask('1').subscribe();

    const req = httpMock.expectOne(`${API_URL}/deleteTasks/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);

    expect(service.tasks().length).toBe(1);
    expect(service.tasks().find((t) => t.id === '1')).toBeUndefined();
  });

  // ---- 5. Mocking an error response ------------------------------
  it('should handle a failed API call gracefully', () => {
    // getTasks() triggers an HTTP GET; it doesn't return an Observable here
    // (the service updates its signals internally), so just call it.
    service.getTasks();

    // Expect the same endpoint used in the other tests
    const req = httpMock.expectOne(API_URL + '/getTasks');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    // Adjust this assertion to match how your service actually surfaces errors,
    // e.g. an `error` signal, empty array fallback, etc.
    expect(service.tasks()).toEqual([]);
  });
});
import test from 'node:test';
import assert from 'node:assert';

// 1. Frontend validation logic
function validateInquiryForm(form) {
  const errors = {};
  if (!form.customerName || form.customerName.trim().length < 2) {
    errors.customerName = ['Name must be at least 2 characters'];
  }
  if (!form.contact || form.contact.trim().length < 5) {
    errors.contact = ['Contact must be at least 5 characters'];
  }
  if (!form.subject || form.subject.trim().length < 3) {
    errors.subject = ['Subject must be at least 3 characters'];
  }
  if (!form.description || form.description.trim().length < 10) {
    errors.description = ['Description must be at least 10 characters'];
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// 2. Frontend status transition rules
const ALLOWED_TRANSITIONS = {
  new: ['in_progress'],
  in_progress: ['resolved'],
  resolved: ['in_progress'], // Reopen rule
};

function canTransition(currentStatus, nextStatus) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

// Tests
test('Form Validation: flags missing and short input fields', () => {
  const badInput = {
    customerName: 'A', // too short (< 2)
    contact: '123',    // too short (< 5)
    subject: 'Hi',     // too short (< 3)
    description: 'Bad',// too short (< 10)
  };

  const result = validateInquiryForm(badInput);
  assert.strictEqual(result.valid, false);
  assert.ok(result.errors.customerName);
  assert.ok(result.errors.contact);
  assert.ok(result.errors.subject);
  assert.ok(result.errors.description);
});

test('Form Validation: accepts compliant customer input', () => {
  const validInput = {
    customerName: 'Priya Fernando',
    contact: 'priya@example.com',
    subject: 'Billing inquiry regarding invoice #42',
    description: 'Customer noticed higher rate applied compared to quote.',
  };

  const result = validateInquiryForm(validInput);
  assert.strictEqual(result.valid, true);
  assert.deepStrictEqual(result.errors, {});
});

test('UI Lifecycle: permits valid transitions (new -> in_progress -> resolved and reopen)', () => {
  assert.strictEqual(canTransition('new', 'in_progress'), true);
  assert.strictEqual(canTransition('in_progress', 'resolved'), true);
  assert.strictEqual(canTransition('resolved', 'in_progress'), true); // reopen
});

test('UI Lifecycle: prevents illegal skip transition (new -> resolved directly)', () => {
  assert.strictEqual(canTransition('new', 'resolved'), false);
  assert.strictEqual(canTransition('resolved', 'new'), false);
});

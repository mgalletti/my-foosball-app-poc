import { InMemoryAdapter } from '../../../src/repositories/adapters/in-memory-adapter.js';

// Define a test model type
interface TestModel {
  id?: string;
  name: string;
  type: string;
  value: number;
}

describe('InMemoryAdapter', () => {
  let adapter: InMemoryAdapter<TestModel>;

  beforeEach(() => {
    // Create a fresh adapter instance before each test
    adapter = new InMemoryAdapter<TestModel>("Test");
  });

  test('should initialize successfully', async () => {
    const result = await adapter.initialize();
    expect(result).toBe(adapter);
  });

  test('should create an item with generated id', async () => {
    const data = { name: 'Test Item', type: 'Entry', value: 42 };
    const result = await adapter.create(data);

    expect(result).toBeDefined();
  });

  test('should find item by id', async () => {
    // Create an item first
    const itemId = await adapter.create({ name: 'Find Me', type: 'Person', value: 123 });

    // Then try to find it
    const found = await adapter.findById(itemId);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(itemId);
    expect(found?.name).toBe('Find Me');
  });

  test('should return null when finding non-existent id', async () => {
    const result = await adapter.findById('non-existent-id');
    expect(result).toBeNull();
  });

  test('should find all items', async () => {
    // Create multiple items
    await adapter.create({ name: 'Item 1', type: 'Person', value: 1 });
    await adapter.create({ name: 'Item 2', type: 'Person', value: 2 });
    await adapter.create({ name: 'Item 3', type: 'Person', value: 3 });

    const allItems = await adapter.findAll();
    expect(allItems).toHaveLength(3);
  });

  test('should find items with query filter', async () => {
    // Create items with different values
    await adapter.create({ name: 'Apple', type: 'Red fruit', value: 10 });
    await adapter.create({ name: 'Banana', type: 'Yellow fruit', value: 20 });
    await adapter.create({ name: 'Strawberry', type: 'Red fruit', value: 30 });

    // Find only items with name 'Apple'
    const apples = await adapter.findAll({ type: 'Red fruit' });
    expect(apples).toHaveLength(2);
    expect(apples.every((item: any) => item.type === 'Red fruit')).toBe(true);
  });

  test('should throw ReferenceError when creating objects with same name', async () => {
    // Create first item
    await adapter.create({ name: 'Duplicate', type: 'Test', value: 100 });

    // Attempt to create second item with same name should throw ReferenceError
    await expect(adapter.create({ name: 'Duplicate', type: 'Test', value: 200 }))
      .rejects
      .toThrow(ReferenceError);
  });

  

  test('should update an existing item', async () => {
    // Create an item
    const itemId = await adapter.create({ name: 'Original', type: 'Product', value: 100 });

    // Update it
    const updated = await adapter.update(itemId, { name: 'Updated', value: 200 });

    expect(updated).not.toBeNull();
    expect(updated?.id).toBe(itemId);
    expect(updated?.name).toBe('Updated');
    expect(updated?.value).toBe(200);

    // Verify the update persisted
    const found = await adapter.findById(itemId);
    expect(found?.name).toBe('Updated');
  });

  test('should return null when updating non-existent item', async () => {
    const result = await adapter.update('non-existent-id', { name: "Won't Work" });
    expect(result).toBeNull();
  });

  test('should delete an existing item', async () => {
    // Create an item
    const itemId = await adapter.create({ name: 'Delete Me', type: 'Operation', value: 999 });

    // Delete it
    const deleteResult = await adapter.delete(itemId);
    expect(deleteResult).toBe(true);

    // Verify it's gone
    const found = await adapter.findById(itemId);
    expect(found).toBeNull();
  });

  test('should return false when deleting non-existent item', async () => {
    const result = await adapter.delete('non-existent-id');
    expect(result).toBe(false);
  });
});

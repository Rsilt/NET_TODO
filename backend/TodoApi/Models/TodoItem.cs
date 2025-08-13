namespace TodoApi.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        public required string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime DueDate { get; set; }
        public bool IsDone { get; set; }
    }
}

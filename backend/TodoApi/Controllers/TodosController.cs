using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly TodoContext _context;

    public TodosController(TodoContext context)
    {
        _context = context;
    }

    // GET: api/todos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodos([FromQuery] bool? done, [FromQuery] string search, [FromQuery] string dueDate)
    {
        var query = _context.TodoItems.AsQueryable();

        if (done.HasValue)
            query = query.Where(t => t.IsDone == done.Value);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(t => t.Description.Contains(search));

        if (!string.IsNullOrEmpty(dueDate))
        {
            if (DateTime.TryParse(dueDate, out var date))
                query = query.Where(t => t.DueDate.Date == date.Date);
        }

        return await query.ToListAsync();
    }
}
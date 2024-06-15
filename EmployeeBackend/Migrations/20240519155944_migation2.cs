using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeBackend.Migrations
{
    /// <inheritdoc />
    public partial class migation2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "photos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "photos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

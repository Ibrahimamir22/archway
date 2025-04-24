import time
from psycopg2 import OperationalError as Psycopg2OpError
from django.db import connections
from django.db.utils import OperationalError as DjangoOpError
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    """Django command to wait for database to be available"""
    help = 'Waits for the database to become available.'

    def handle(self, *args, **options):
        """Handle command execution"""
        self.stdout.write('Waiting for database...') 
        db_conn = None
        db_alias = 'default' # Assuming default database connection
        attempts = 0
        max_attempts = 30 # Wait up to 30 seconds (adjust as needed)

        while db_conn is None and attempts < max_attempts:
            try:
                # Try getting the connection to trigger potential errors
                connections[db_alias].ensure_connection()
                # If the above line doesn't raise an error, connection is likely okay
                db_conn = True # Mark as successful
                self.stdout.write(self.style.SUCCESS('Database available!'))
            except (Psycopg2OpError, DjangoOpError) as e:
                self.stdout.write(f".", ending='')
                time.sleep(1)
                attempts += 1
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Unexpected error connecting to database: {e}"))
                time.sleep(1)
                attempts += 1

        if db_conn is None:
            self.stderr.write(self.style.ERROR('Database unavailable after waiting.'))
            # Exit with an error code if the database is not available
            exit(1) 
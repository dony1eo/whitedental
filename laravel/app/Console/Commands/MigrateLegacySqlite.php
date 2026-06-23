<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateLegacySqlite extends Command
{
    protected $signature = 'db:migrate-legacy-sqlite {--dry-run}';
    protected $description = 'Copy data from legacy SQLite (database/database.sqlite) into the default (PostgreSQL) connection';

    private array $tables = [
        'branches',
        'users',
        'services',
        'suppliers',
        'patient_groups',
        'campaigns',
        'patients',
        'dental_teeth',
        'appointments',
        'treatment_plans',
        'treatment_lines',
        'treatment_plan_items',
        'payments',
        'patient_documents',
        'materials',
        'warehouse_docs',
        'warehouse_doc_lines',
        'cashbox_entries',
        'leads',
        'tasks',
        'waitlist',
    ];

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        if (!Schema::connection('sqlite_legacy')->hasTable('users')) {
            $this->error('Legacy SQLite database.sqlite not found or empty.');
            return self::FAILURE;
        }

        $this->info(sprintf('Source: SQLite legacy. Target: %s.', config('database.default')));
        $this->info($dryRun ? 'DRY-RUN mode: no rows will be written.' : 'Copying data...');

        $totalCopied = 0;
        $totalSkipped = 0;

        foreach ($this->tables as $table) {
            $exists = Schema::connection('sqlite_legacy')->hasTable($table);
            if (!$exists) {
                $this->line(sprintf('- %-22s : missing in legacy, skip', $table));
                $totalSkipped++;
                continue;
            }

            $rows = DB::connection('sqlite_legacy')->table($table)->get();

            if ($rows->isEmpty()) {
                $this->line(sprintf('- %-22s : 0 rows', $table));
                continue;
            }

            $rowsArray = $rows->map(fn ($r) => (array) $r)->all();

            if (!$dryRun) {
                DB::table($table)->insert($rowsArray);

                $maxId = (int) (DB::table($table)->max('id') ?? 0);
                if ($maxId > 0) {
                    DB::statement(
                        sprintf('SELECT setval(%s, %d, true);', DB::getPdo()->quote($table.'_id_seq'), $maxId)
                    );
                }
            }

            $count = count($rowsArray);
            $totalCopied += $count;
            $this->info(sprintf('+ %-22s : %d rows%s', $table, $count, $dryRun ? ' (dry-run)' : ''));
        }

        $this->newLine();
        $this->info(sprintf('Done. %d rows %s, %d tables skipped.',
            $totalCopied,
            $dryRun ? 'would be copied' : 'copied',
            $totalSkipped));

        return self::SUCCESS;
    }
}
<?php

use App\Management\Controllers\AcademicPeriodController;
use App\Management\Controllers\AcademicYearController;
use App\Management\Controllers\ClassController;
use App\Management\Controllers\CourseController;
use App\Management\Controllers\DepartmentController;
use App\Management\Controllers\FacultyController;
use App\Management\Controllers\MyController;
use App\Management\Controllers\RbacController;
use App\Management\Controllers\SectionController;
use App\Management\Controllers\SyllabusController;
use App\Management\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::get('/', function () {
    return response()->json(['status' => 'API root reached']);
});
Route::get('/healthcheck', function () {
    return response()->json(['status' => 'ok']);
});

use Illuminate\Support\Facades\Redis;
use App\Models\User;

Route::get('/test-connection', function () {
    $userCount = User::count();

    Redis::set('last_test', now()->toDateTimeString());
    $lastTest = Redis::get('last_test');

    return response()->json([
        'database_user_count' => $userCount,
        'redis_last_test' => $lastTest,
    ]);
});




// Expose for Students to be able to see academic years and departments
Route::get('/academic-year', [AcademicYearController::class, 'indexAcademicYears']);
Route::get('/departments', [DepartmentController::class, 'indexQueryFilter']);



Route::middleware(['auth:sanctum'])->group(
    function () {

        Route::group(['prefix' => 'me'], function () {
            Route::get('', [MyController::class, 'me']);
            Route::get('/assigned-courses', [SyllabusController::class, 'queryAssignedCourses']);
            Route::get('/syllabi', [MyController::class, 'indexFilterQueryMySyllabi']);
            Route::get('/syllabi-request-forms', [SyllabusController::class, 'queryMySyllabusRequestForms']);
        });

        Route::group(['prefix' => 'academic-structure'], function () {
            Route::group(['prefix' => 'faculties'], function () {
                Route::get('/', [FacultyController::class, 'indexQueryFilter']);
                Route::get('/{id}', [FacultyController::class, 'show']);
                Route::post('/', [FacultyController::class, 'store']);
                Route::put('/{id}', [FacultyController::class, 'update']);
                Route::patch('/{id}/disable', [FacultyController::class, 'disable']);
                Route::patch('/{id}/enable', [FacultyController::class, 'enable']);
                Route::post('/{id}/assign', [FacultyController::class, 'assign']);
            });

            Route::group(['prefix' => 'departments'], function () {
                Route::get('/', [DepartmentController::class, 'indexQueryFilter']);
                Route::post('/', [DepartmentController::class, 'storeDepartment']);
                Route::get('/{id}', [DepartmentController::class, 'showDepartment']);
                Route::put('/{id}', [DepartmentController::class, 'updateDepartment']);
                Route::patch('/{id}/disable', [DepartmentController::class, 'disableADepartment']);
                Route::patch('/{id}/enable', [DepartmentController::class, 'enableADepartment']);
                Route::post('/{id}/assign', [DepartmentController::class, 'assign']);
            });
        });

        Route::group(['prefix' => 'academic-periods'], function () {
            Route::get('/', [AcademicPeriodController::class, 'indexFilerAcademicPeriods']);
            Route::post('/', [AcademicPeriodController::class, 'storeAcademicYearWithSemesters']);
            Route::group(['prefix' => 'academic-years'], function () {
                Route::get('query/', [AcademicYearController::class, 'indexQueryAcademicYears']);
                Route::get('/', [AcademicYearController::class, 'indexAcademicYears']);
                Route::get('/{id}', [AcademicYearController::class, 'showAcademicYear']);
                Route::delete('/{id}', [AcademicYearController::class, 'deleteAcademicYear']);
                Route::post('/', [AcademicYearController::class, 'storeAcademicYear']);
                Route::get('/{id}/semesters', [AcademicYearController::class, 'indexQuerySemestersInAcademicYear']);
                Route::post('/{id}/semesters', [AcademicYearController::class, 'storeSemesterForAcademicYear']);
                Route::put('/{id}/semesters/{semester}', [AcademicYearController::class, 'updateSemesterForAcademicYear']);
                Route::get('/{id}/semesters/{semester}/classes', [ClassController::class, 'showClassesForSemester']);
                Route::post('/{id}/duplications', [AcademicYearController::class, 'duplicateAcademicYear']);
            });
        });

        Route::group(['prefix' => 'classes'], function () {
            Route::post('/', [ClassController::class, 'storeClass']);
            Route::get('/', [ClassController::class, 'indexQueryClasses']);
            Route::get('/{id}', [ClassController::class, 'showAClass']);
            Route::patch('/{id}', [ClassController::class, 'editClass']);
            Route::delete('/{id}', [ClassController::class, 'destroyAClass']);
        });

        Route::group(['prefix' => 'sections'], function () {
            Route::post('/', [SectionController::class, 'storeClassSectionsWithSchedules']);
            Route::get('/{id}', [SectionController::class, 'showAClassSection']);
            Route::put('/{id}', [SectionController::class, 'updateAClassSection']);
            Route::delete('/{id}', [SectionController::class, 'deleteAClassSection']);
            Route::post('/{id}/students', [SectionController::class, 'bulkAddStudentsToClassSection']);
            Route::post('/{id}/student', [SectionController::class, 'addStudentToClassSection']);
            Route::delete('/{id}/students/{studentId}', [SectionController::class, 'removeStudentFromClassSection']);
        });

        Route::group(['prefix' => 'rbac'], function () {
            Route::get('/roles', [RbacController::class, 'indexRoles']);
            Route::get('/permissions', [RbacController::class, 'indexPermissions']);
            Route::post('/roles', [RbacController::class, 'storeRoleWithPermissions']);
            Route::patch('/roles/{role}/permissions', [RbacController::class, 'addPermissionsToRole']);
            Route::put('/roles/{role}/permissions', [RbacController::class, 'assginPermissionsToRole']);
            Route::delete('/roles/{role}/permissions', [RbacController::class, 'removePermissionsFromRole']);
        });

        Route::group(['prefix' => 'users'], function () {
            Route::get('/', [UserController::class, 'indexFilterUsers']);
            Route::post('/', [UserController::class, 'storeUser']);
            Route::get('/{id}', [UserController::class, 'showUser']);
            Route::patch('/{id}', [UserController::class, 'updateUser']);
            Route::patch('/{id}/disable', [UserController::class, 'disableAUser']);
            Route::patch('/{id}/enable', [UserController::class, 'enableAUser']);
        });



        Route::group(['prefix' => 'courses'], function () {
            Route::get('/', [CourseController::class, 'indexFilterCourses']);
            Route::get('/course-assignments', [CourseController::class, 'queryCourseAssignments']);
            Route::post('/create', [CourseController::class, 'storeCourse']);
            Route::post('/create-anyway', [CourseController::class, 'storeCourseAnyway']);
            Route::put('/assign-instructor', [CourseController::class, 'assignInstructorToCourse']);
            Route::post('/assign-academic-period', [CourseController::class, 'assignCourseToAcademicPeriod']);
            Route::post('/assign-user', [CourseController::class, 'assignUserToCourse']);
            Route::get('/{id}', [CourseController::class, 'showCourse']);
            Route::patch('/{id}', [CourseController::class, 'updateCourse']);
            Route::patch('/{id}/disable', [CourseController::class, 'disableACourse']);
            Route::patch('/{id}/enable', [CourseController::class, 'enableACourse']);
            Route::patch('/course-assignments/{id}/disable', [CourseController::class, 'disableACourseAssignment']);
            Route::patch('/course-assignments/{id}/enable', [CourseController::class, 'enableACourseAssignment']);
        });

        // Syllabus routes
        Route::prefix('syllabus')->group(function () {
            Route::get('/', [SyllabusController::class, 'queryApprovedSyllabi']);
            Route::get('/logo-image', [SyllabusController::class, 'getLogoImage']);
            Route::get('/download/template', [SyllabusController::class, 'getWordDocumentTemplate']);
            Route::post('/{id}/add-comment', [SyllabusController::class, 'addCommentToSyllabus']);
            Route::get('/student-syllabi', [SyllabusController::class, 'queryFilterApprovedSyllabiForStudent']);
            Route::post('/submit-request-form', [SyllabusController::class, 'submitSyllabusRequestForm']);
            Route::put('/{id}/approve', [SyllabusController::class, 'approveSyllabus']);
            Route::put('/{id}/reject', [SyllabusController::class, 'rejectSyllabus']);
            Route::post('/create', [SyllabusController::class, 'createASyllabus']);
            Route::put('/save/{id}', [SyllabusController::class, 'saveProgress']);
            Route::post('/save-file-upload/{id}', [SyllabusController::class, 'saveFileUpload']);
            Route::post('/submit', [SyllabusController::class, 'submit']);
            Route::post('/reject', [SyllabusController::class, 'reject']);
            Route::post('/upload', [SyllabusController::class, 'uploadFile']);
            Route::get('/preview-template/{id}', [SyllabusController::class, 'previewTemplate']);
            Route::get('/templates', [SyllabusController::class, 'getTemplates']);
            Route::get('/templates/{id}', [SyllabusController::class, 'getTemplateContent']);
            Route::get('/download/{id}', [SyllabusController::class, 'handleDownloadSyllabus']);
            Route::post('/download', [SyllabusController::class, 'handleBulkDownload']);
            Route::get('/download-with-watermark/{id}', [SyllabusController::class, 'handleDownloadWithWatermark']);
            Route::post('/download-with-watermark', [SyllabusController::class, 'handleBulkDownloadWithWatermark']);
            Route::get('/{id}', [SyllabusController::class, 'showSyllabus']);
            Route::post('/render-custom', [SyllabusController::class, 'renderCustom']);
            Route::post('/render-latex', [SyllabusController::class, 'renderLatex']);
            Route::post('/templates', [SyllabusController::class, 'createATemplate']);
            Route::patch('/templates/{id}/disable', [SyllabusController::class, 'disableATemplate']);
        });
    }
);

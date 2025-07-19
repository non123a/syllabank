<?php

namespace App\Management\Renderers;

use Exception;
use Illuminate\Support\Facades\File;

class SyllabusRenderer
{
    private $content;
    private $debugLog = [];

    public function __construct(array $content)
    {
        $this->content = $content;
    }

    public function render(): string
    {
        try {
            $html = $this->renderHead();
            $html .= $this->renderBody();
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in render method: " . $e->getMessage());
            return $this->getDebugOutput();
        }
    }

    private function renderHead(): string
    {
        try {
            $head = $this->content['head'];
            $html = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
            $html .= "<meta charset=\"UTF-8\">\n";
            $html .= "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n";
            $html .= "<title>{$head['title']}</title>\n";
            $html .= "<style>\n";
            $html .= $this->getStyles();
            $html .= "</style>\n";
            $html .= "</head>\n";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderHead method: " . $e->getMessage());
            throw $e;
        }
    }

    private function getStyles(): string
    {
        return "
            @page { margin: 100px 25px 80px 25px; }
            @page :first { margin-top: 0; }
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                counter-reset: page;
            }
            .header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 100px;
                padding: 10px 25px;
            }
            
            .course-schedule table tbody tr td {
            border: none;
            padding: 0; /* optional, if you also want to remove padding */
            }

            
            .course-schedule table tbody tr:nth-child(2) td {
            border-top: 1px solid #ccc;
            }

            .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 50px;
                padding: 10px 25px;
                text-align: left;
                font-size: 0.9em;
                color: #666;
                border-top: 0.4pt solid #666;
            }
            .content {
                margin-top: 120px;
                margin-bottom: 70px;
                padding: 0 25px;
            }
            .logo-container {
                float: left;
                width: 30%;
            }
            .logo {
                max-width: 100%;
                height: auto;
            }
            .course-info {
                float: right;
                width: 70%;
                text-align: right;
                color: #1F1F7C;
            }
            .course-info p {
                margin: 0;
                line-height: 1.4;
                font-weight: bold;
            }
            .header-divider {
                clear: both;
                border-top: 2px solid #1F1F7C;
                margin-top: 10px;
            }
            .section-title {
                color: #1F1F7C;
                font-size: 1.5em;
                font-weight: bold;
                margin-top: 30px;
                margin-bottom: 15px;
                border-bottom: 1px solid #1F1F7C;
                padding-bottom: 5px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f0f0f0;
                color: #1F1F7C;
            }
            ul {
                padding-left: 20px;
            }
            @media print {
                .header { display: none; }
                .first-page .header { display: block; }
                .content { page-break-before: always; }
                .content::after {
                    content: counter(page);
                    counter-increment: page;
                }
                .first-page .content::after {
                    content: none;
                }
            }
        ";
    }

    private function renderBody(): string
    {
        try {
            $body = $this->content['body'];
            $html = "<body>\n";
            $html .= "<div class=\"first-page\">\n";
            $html .= $this->renderHeader($body['header']);
            $html .= "<div class=\"content\">\n";
            $html .= $this->renderContent($body['content']);
            $html .= "</div>\n";
            $html .= "</div>\n";
            if (isset($body['footer'])) {
                $html .= $this->renderFooter($body['footer']);
            }
            $html .= "</body>\n</html>";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderBody method: " . $e->getMessage());
            throw $e;
        }
    }

    private function renderHeader(array $header): string
    {
        try {
            $logoPath = public_path($header['logo']['src']);
            $html = '<div class="header">';
            $html .= '<div class="logo-container">';
            if (file_exists($logoPath)) {
                $logoData = base64_encode(file_get_contents($logoPath));
                $html .= '<img src="data:image/png;base64,' . $logoData . '" alt="' . $header['logo']['alt'] . '" class="logo">';
            } else {
                $html .= '<p>Logo not available</p>';
            }
            $html .= '</div>';
            $html .= '<div class="course-info">';
            foreach ($header['courseInfo'] as $key => $value) {
                $html .= "<p><strong>$value</strong></p>";
            }
            $html .= '</div>';
            $html .= '<div class="header-divider"></div>';
            $html .= '</div>';
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderHeader method: " . $e->getMessage());
            throw $e;
        }
    }

    private function renderContent(array $content): string
    {
        try {
            $orderedSections = [
                'instructorInfo',
                'taInfo',
                'courseDescription',
                'learningOutcomes',
                'learningResources',
                'assessment',
                'coursePolicies',
                'courseObjectives',
                'courseDistribution',
                'courseSchedule'
            ];

            $html = "";

            // Render predefined sections first
            foreach ($orderedSections as $sectionKey) {
                if (isset($content[$sectionKey])) {
                    $html .= $this->renderSection($sectionKey, $content[$sectionKey]);
                }
            }

            // Render any additional sections not in the predefined order
            foreach ($content as $sectionKey => $sectionData) {
                if (!in_array($sectionKey, $orderedSections)) {
                    $html .= $this->renderSection($sectionKey, $sectionData);
                }
            }

            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderContent method: " . $e->getMessage());
            throw $e;
        }
    }

    private function renderSection(string $sectionKey, $data): string
    {
        try {
            $html = "<div class=\"section\">\n";
            $html .= "<h2 class=\"section-title\">" . (isset($data['title']) ? $data['title'] : $sectionKey) . "</h2>\n";

            if (isset($data['description'])) {
                $html .= $data['description'] . "\n";
            }

            switch ($sectionKey) {
                
                case 'learningOutcomes':
                    // if (isset($data['list'])) {
                    //     $html .= $this->renderList($data['list']);
                    // }
                    // break;
                    if (isset($data['table'])) {
                        // $html .= $this->renderTable($data['table']);
                        $html .= $this->renderLearningOutcomesTable($data['table']);
                    } elseif (isset($data['list'])) {
                        $html .= $this->renderList($data['list']);
                    }
                    break;
                case 'courseObjectives':
                case 'instructorInfo':
                case 'taInfo':
                case 'assessment':
                case 'courseSchedule':
                    // if (isset($data['table'])) {
                    //     $html .= $this->renderTable($data['table']);
                    // }
                    // break;
                    if (isset($data['weeks'])) {
                        $html .= $this->renderCourseScheduleNested($data['weeks']);
                    } elseif (isset($data['table'])) {
                        $html .= $this->renderTable($data['table']);
                    }
                    break;
                case 'coursePolicies':
                    if (isset($data['table'])) {
                        // $html .= $this->renderTable($data['table']);
                        $html .= $this->renderCoursePoliciesTable($data['table']);
                    } elseif (isset($data['list'])) {
                        $html .= $this->renderList($data['list']);
                    }
                    break;
                case 'courseDistribution':
                    $html .= $this->renderCourseDistribution($data['table'] ?? []);
                    break;
                default:
                    if (isset($data['table'])) {
                        $html .= $this->renderTable($data['table']);
                    } elseif (isset($data['content'])) {
                        $html .= is_string($data['content']) ? $data['content'] : "<p>" . json_encode($data['content']) . "</p>";
                    }
            }

            $html .= "</div>\n";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderSection method for section '$sectionKey': " . $e->getMessage());
            throw $e;
        }
    }

    private function renderList($list): string
    {
        try {
            if (is_string($list)) {
                $items = explode("]], [[", trim($list, "[]"));
                $html = "<ul>\n";
                foreach ($items as $item) {
                    $html .= "<li>" . trim($item, "[]") . "</li>\n";
                }
                $html .= "</ul>\n";
                return $html;
            }

            if (!is_array($list)) {
                $this->logDebug("Invalid list type: " . gettype($list));
                return "";
            }

            $html = "<ul>\n";
            foreach ($list as $item) {
                $html .= "<li>" . (is_array($item) ? $item['content'] : $item) . "</li>\n";
            }
            $html .= "</ul>\n";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderList method: " . $e->getMessage());
            throw $e;
        }
    }

    private function renderTable($table): string
    {
        try {
            $html = "<table>\n";
            if (isset($table['headers'])) {
                $html .= "<tr>\n";
                foreach ($table['headers'] as $header) {
                    $html .= "<th>{$header}</th>\n";
                }
                $html .= "</tr>\n";
            }
            foreach ($table['rows'] as $row) {
                $html .= "<tr>\n";
                foreach ($row as $cell) {
                    $html .= "<td>{$cell}</td>\n";
                }
                $html .= "</tr>\n";
            }
            $html .= "</table>\n";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderTable method: " . $e->getMessage());
            throw $e;
        }
    }

    private function renderDataTable(array $data): string
    {
        try {
            $html = "<table>\n";
            if (isset($data['headers'])) {
                $html .= "<tr>\n";
                foreach ($data['headers'] as $header) {
                    $html .= "<th>{$header}</th>\n";
                }
                $html .= "</tr>\n";
            }
            foreach ($data['rows'] as $row) {
                $html .= "<tr>\n";
                foreach ($row as $cell) {
                    $html .= "<td>{$cell}</td>\n";
                }
                $html .= "</tr>\n";
            }
            $html .= "</table>\n";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderDataTable method: " . $e->getMessage());
            throw $e;
        }
    }

    private function renderPolicies($policies): string
    {
        try {
            $html = "<ul>\n";
            foreach ($policies as $policy) {
                $html .= "<li><strong>{$policy['name']}:</strong> {$policy['content']}</li>\n";
            }
            $html .= "</ul>\n";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderPolicies method: " . $e->getMessage());
            throw $e;
        }
    }

    private function renderFooter(array $footer): string
    {
        try {
            return "<div class=\"footer\">\n<p>{$footer['content']}</p>\n</div>\n";
        } catch (Exception $e) {
            $this->logDebug("Error in renderFooter method: " . $e->getMessage());
            throw $e;
        }
    }

    private function logDebug(string $message): void
    {
        $this->debugLog[] = $message;
    }

    private function getDebugOutput(): string
    {
        $output = "<h1>Debug Output</h1>\n";
        $output .= "<pre>\n";
        $output .= print_r($this->debugLog, true);
        $output .= "\n</pre>\n";
        $output .= "<h2>Content Structure</h2>\n";
        $output .= "<pre>\n";
        $output .= print_r($this->content, true);
        $output .= "\n</pre>\n";
        return $output;
    }

//  add new way for display learning out come table

    private function renderLearningOutcomesTable($table): string
    {
        try {
            $html = "<p style=\"margin-top: 20px; font-size: 1.1em;\">Upon completion of this course, the student will be able to:</p>";
            
            $html .= "<table style=\"border: none; border-collapse: collapse; width: 100%;\">\n";

            foreach ($table['rows'] as $index => $row) {
                $plo = isset($row[0]) ? $row[0] : '';
                $desc = isset($row[1]) ? $row[1] : '';
                if (!is_array($desc) && str_contains($desc, "\n")) {
                    $desc = explode("\n", $desc); // Turn multiline string into array
                }
                $number = $index + 1;
            
                $html .= "<tr>\n";
                $html .= "<td style=\"width: 15%; font-weight: bold; vertical-align: top; border: none;\">{$plo}</td>\n";
                $html .= "<td style=\"width: 85%; padding-left: 10px; border: none;\">";
                $html .= ($index + 1) . ". ";

                if (is_array($desc)) {
                    foreach ($desc as $line) {
                        $html .= htmlspecialchars(trim($line)) . "<br/>";
                    }
                } else {
                    $html .= htmlspecialchars($desc);
                }

                $html .= "</td>\n";


            }
            

            $html .= "</table>\n";
            return $html;
        } catch (Exception $e) {
            $this->logDebug("Error in renderLearningOutcomesTable: " . $e->getMessage());
            return '';
        }
    }
    
    private function renderCoursePoliciesTable($table): string
    {
        try {
            $html = '<table style="border-collapse: collapse; width: 100%; font-size: 1em;">';

            // Render headers
            if (isset($table['headers']) && is_array($table['headers'])) {
                $html .= '<thead><tr>';
                foreach ($table['headers'] as $header) {
                    $html .= '<th style="background-color: #eee; padding: 8px; text-align: left; font-weight: bold; border: 1px solid #ccc;">'
                        . htmlspecialchars($header) . '</th>';
                }
                $html .= '</tr></thead>';
            }

            // Render rows
            if (isset($table['rows']) && is_array($table['rows'])) {
                $html .= '<tbody>';
                foreach ($table['rows'] as $row) {
                    $html .= '<tr>';
                    foreach ($row as $cell) {
                        $html .= '<td style="padding: 8px; border: 1px solid #ccc;">';
                        if (is_string($cell) && str_contains($cell, "\n")) {
                            $lines = explode("\n", $cell);
                            foreach ($lines as $line) {
                                $html .= htmlspecialchars(trim($line)) . '<br/>';
                            }
                        } else {
                            $html .= htmlspecialchars($cell);
                        }
                        $html .= '</td>';
                    }
                    $html .= '</tr>';
                }
                $html .= '</tbody>';
            }

            $html .= '</table>';
            return $html;
        } catch (\Exception $e) {
            $this->logDebug("Error rendering Course Policies table: " . $e->getMessage());
            return '';
        }
    }
    
    private function renderCourseScheduleNested(array $courseSchedule): string
    {
        if (empty($courseSchedule)) return '';

        $html = '<table width="100%" cellpadding="6" cellspacing="0" border="1" style="border-collapse: collapse; font-size: 14px; text-align: center;" >';
        $html .= '
            <thead>
                <tr style="background: #f2f2f2;">
                    <th style="width: 8%;">Sessions</th>
                    <th style="width: 15%;">Module</th>
                    <th style="width: 27%;">Learning Outcomes</th>
                    <th style="width: 30%;">Delivery Method</th>
                    <th style="width: 10%; font-size: 14px;">Assignments / Reading</th>
                    <th style="width: 10%; font-size: 14px;">Assessment</th>
                </tr>
            </thead>
            <tbody>';

        foreach ($courseSchedule as $wIdx => $wData) {
            $weekLabel = 'Session ' . ($wIdx + 1);
            $module = '<strong>' . htmlspecialchars($wData['module'] ?? '') . '</strong>';

            // Learning outcomes
            $outcomeHtml = '';
            if (!empty(trim($wData['learningOutcomes'] ?? ''))) {
                $lines = explode("\n", trim($wData['learningOutcomes']));
                $outcomeHtml .= '<div style="text-align: left;">';
                foreach ($lines as $line) {
                    $outcomeHtml .= htmlspecialchars(trim($line)) . '<br>';
                }
                $outcomeHtml .= '</div>';
            }

                        // Delivery method rows
            $deliveryRows = '';
            foreach ($wData['deliveryMethods'] as $delivery) {
                $methods = $delivery['methods'] ?? [];
                $rowspan = count($methods);
                $firstRow = true;
                $i = 0;

                foreach ($methods as $m) {
                    $borderRowStyle = ($i === 1) ? 'style="border-top: 1px solid #ccc;"' : '';
                
                    $deliveryRows .= "<tr $borderRowStyle>";
                
                    if ($firstRow) {
                        $deliveryRows .= '<td rowspan="' . $rowspan . '" style="
                            font-style: italic;
                            vertical-align: middle;
                            border: none;
                            width: 60px;
                            max-width: 60px;
                        ">' . htmlspecialchars($delivery['day']) . '</td>';
                        $firstRow = false;
                    }
                
                    $deliveryRows .= '<td style="width: 190px; max-width: 190px; border: none;">' . htmlspecialchars($m['method']) . '</td>';
                    $deliveryRows .= '<td style="width: 30px; max-width: 30px; border: none;">' . htmlspecialchars($m['duration']) . '</td>';
                    $deliveryRows .= '</tr>';
                
                    $i++;
                }
                
                
            }

            // Delivery table
            $deliveryHtml = '
            <table width="100%" style="
                border-collapse: collapse;
                font-size: 12px;
                text-align: center;
                border: none;
                margin: 0;
                table-layout: fixed;
                
            ">
                <tbody>' . $deliveryRows . '</tbody>
            </table>';



            // Assignment & Assessment
            $assign = trim($wData['assignments'] ?? '') ?: '-';
            $assess = trim($wData['assessment'] ?? '') ?: '-';

            $html .= '<tr>';
            $html .= '<td>' . $weekLabel . '</td>';
            $html .= '<td>' . $module . '</td>';
            $html .= '<td>' . $outcomeHtml . '</td>';
            $html .= '<td style="padding: 0; border: none;">' . $deliveryHtml . '</td>';
            $html .= '<td style="font-size: 12px;">' . htmlspecialchars($assign) . '</td>';
            $html .= '<td style="font-size: 12px;">' . htmlspecialchars($assess) . '</td>';
            $html .= '</tr>';
        }

        $html .= '</tbody></table>';
        return $html;
    }
    // In Edit.js, replace renderStructuredCourseSchedule with this version:


  
    /* ------------------------------------------------------------------ */
    /*  Custom renderer for Course Distribution                           */
    /* ------------------------------------------------------------------ */
    private function renderCourseDistribution($table): string
    {
        if (empty($table['rows'])) {
            return '';
        }

        $html  = '<table width="100%" style="border-collapse:collapse; font-size:14px;">';
        $html .= '<thead><tr style="background:#f2f2f2;">';
        foreach ($table['headers'] as $i => $head) {
            // fixed widths: 25 % | 35 % | 20 % | 20 %
            $width = [25, 35, 20, 20][$i] . '%';
            $html .= '<th style="width:'.$width.'; border:1px solid #ccc; text-align:center;">'
                . htmlspecialchars($head) . '</th>';
        }
        $html .= '</tr></thead><tbody>';

        foreach ($table['rows'] as $row) {
            $html .= '<tr>';
            foreach ($row as $idx => $cell) {
                $align  = $idx === 1 ? 'left' : 'center';             // Delivery Method → left align
                $cell   = nl2br(htmlspecialchars($cell));             // keep textarea line-breaks
                $html  .= '<td style="border:1px solid #ccc; text-align:'.$align.';">'
                        . $cell . '</td>';
            }
            $html .= '</tr>';
        }

        $html .= '</tbody></table>';
        return $html;
    }

    

    

}

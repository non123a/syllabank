import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'


import {
  Container,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem
} from '@mui/material'
import dynamic from 'next/dynamic'
import Layout from 'src/layouts'
import Page from 'src/components/Page'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import { PATH_DASHBOARD } from 'src/routes/paths'
import axios from 'src/utils/axios'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { useSnackbar } from 'notistack'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import PreviewIcon from '@mui/icons-material/Preview'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

SyllabusEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default function SyllabusEdit() {
  const router = useRouter()
  const { id } = router.query
  const [content, setContent] = useLocalStorage(`syllabus-content-${id}`, null)
  const [pdfPreview, setPdfPreview] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [currentSection, setCurrentSection] = useState(null)
  const [currentSectionKey, setCurrentSectionKey] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
// for store total hour of courseDistribution
  // const [courseDistributionTotalHours, setCourseDistributionTotalHours] = useState(0)
  const [courseDistributionTotalHours, setCourseDistributionTotalHours] = useState(0)
  const [courseScheduleTotalHours, setCourseScheduleTotalHours] = useState(0)
  const [hoursMismatchWarning, setHoursMismatchWarning] = useState('')

  // useEffect(() => {
  //   if (id) {
  //     fetchSyllabus()
  //   }
  // }, [id])
  useEffect(() => {

    if (id && router.isReady) {

      fetchSyllabus()

    }

  }, [id, router.isReady])
  useEffect(() => {
    if (!content) return
  
    // Function to parse schedule total hours (like before)
    const getScheduleTotal = () => {
      const weeks = content.body?.content?.courseSchedule?.weeks || []
      let total = 0
  
      weeks.forEach(week => {
        week.deliveryMethods?.forEach(delivery => {
          delivery.methods?.forEach(method => {
            let dur = method.duration?.toLowerCase()?.trim() || ''
            if (!dur) return
  
            let hours = 0
            if (dur.endsWith('h')) {
              hours = parseFloat(dur.replace('h', ''))
            } else if (dur.endsWith('m')) {
              const minutes = parseFloat(dur.replace('m', ''))
              hours = minutes / 60
            } else {
              hours = parseFloat(dur)
            }
            if (!isNaN(hours)) total += hours
          })
        })
      })
  
      return Math.round(total * 100) / 100
    }
  
    // Function to parse course distribution total hours
    const getDistributionTotal = () => {
      const table = content.body?.content?.courseDistribution?.table
      if (!table) return 0
  
      const headers = table.headers || []
      const rows = table.rows || []
  
      const hoursColIndex = headers.findIndex(h => h.toLowerCase().includes('hour'))
      if (hoursColIndex === -1) return 0
  
      let total = 0
      rows.forEach(row => {
        if (!row || !row[hoursColIndex]) return
        const val = parseFloat(row[hoursColIndex])
        if (!isNaN(val)) total += val
      })
  
      return Math.round(total * 100) / 100
    }
  
    const scheduleTotal = getScheduleTotal()
    const distributionTotal = getDistributionTotal()
  
    setCourseScheduleTotalHours(scheduleTotal)
    setCourseDistributionTotalHours(distributionTotal)
  
    if (scheduleTotal < distributionTotal) {
      setHoursMismatchWarning(
        `⚠️ Warning: Schedule total hours (${scheduleTotal}h) do not match distribution total hours (${distributionTotal}h).`
      )
    } else {
      setHoursMismatchWarning('')
    }
  }, [content])
  
  const fetchSyllabus = async () => {
    try {
      const response = await axios.get(`/syllabus/${id}`)
      if (response.data) {
        const parsedContent = JSON.parse(response.data.content)
        console.log("🔎 FETCHED SYLLABUS:", parsedContent)

        // const query = router.query

        const query = router.query || {}

        if (!parsedContent.body.header.courseInfo) {

          parsedContent.body.header.courseInfo = {}

        }

        const courseInfo = parsedContent.body.header.courseInfo

        

        // ✅ Overwrite only if field is default/empty

        if (query.syllabusName && (!courseInfo.courseCode || courseInfo.courseCode === '[Course Code]')) {

          courseInfo.courseCode = query.syllabusName

        }

        // Make sure courseInfo exists


        if (query.academicYear && (!courseInfo.academicYear || courseInfo.academicYear.includes('20XX'))) {

          courseInfo.academicYear = query.academicYear

        }

        if (query.semester && (!courseInfo.semester || courseInfo.semester.includes('Semester X'))) {

          courseInfo.semester = `Semester ${query.semester}`

        }



        // // --- STEP 1: Extract credit number ---
        // let creditStr = courseInfo.credits || ''
        // let creditMatch = creditStr.match(/Credits:\s*(\d+)/)
        // let creditNumber = creditMatch ? parseInt(creditMatch[1], 10) : (parseInt(dbCredit, 10) || 0)

        // // Guard against zero or invalid
        // if (creditNumber > 0) {
        //   const expectedHours = creditNumber * 15

        //   // --- STEP 2: Calculate courseSchedule total hours ---
        //   const scheduleWeeks = parsedContent.body.content.courseSchedule?.weeks || []
        //   let totalScheduleHours = 0
        //   scheduleWeeks.forEach(week => {
        //     if (Array.isArray(week.deliveryMethods)) {
        //       week.deliveryMethods.forEach(methodGroup => {
        //         if (Array.isArray(methodGroup.methods)) {
        //           methodGroup.methods.forEach(method => {
        //             totalScheduleHours += parseFloat(method.duration || 0)
        //           })
        //         }
        //       })
        //     }
        //   })

        //   // --- STEP 3: Calculate courseDistribution total hours ---
        //   const courseDistTable = parsedContent.body.content.courseDistribution?.table?.rows || []
        //   let totalDistributionHours = 0
        //   courseDistTable.forEach(row => {
        //     const hours = row?.[2] // assuming column index 2 is 'Hours'
        //     totalDistributionHours += parseFloat(hours || 0)
        //   })

        //   // --- STEP 4: Compare ---
        //   if (totalScheduleHours !== expectedHours) {
        //     console.warn(`⚠️ Total schedule hours (${totalScheduleHours}) don't match expected hours (${expectedHours})`)
        //   }

        //   if (totalDistributionHours !== expectedHours) {
        //     console.warn(`⚠️ Total distribution hours (${totalDistributionHours}) don't match expected hours (${expectedHours})`)
        //   }
        // }


      

    

        if (!courseInfo.credits || courseInfo.credits.includes('Credits X')) {

          try {

            const parsedSections = JSON.parse(response.data.sections)

            if (Array.isArray(parsedSections)) {

              courseInfo.credits = `Credits: ${parsedSections[0]}`

            }

          } catch (err) {

            console.warn('Could not parse sections for credits fallback', err)

          }

        }



        const dbCredit = response.data.credit



        // Set into courseInfo if empty

        if (!parsedContent.body.header.courseInfo.credits || parsedContent.body.header.courseInfo.credits === 'Credits: X') {

          parsedContent.body.header.courseInfo.credits = `Credits: ${dbCredit}`

        }

        parsedContent.body.header.courseInfo = courseInfo



        // add course distribution
        if (!parsedContent.body.content.courseDistribution) {
          parsedContent.body.content.courseDistribution = {
            title: 'Course Distribution',
            description: '',
            table: { headers: ['Domain','Delivery Method','Hour', 'Credit'], rows: [['', '','','']] }
          };
        }
        // inside fetchSyllabus() AFTER you decode JSON
        if (!parsedContent.body.content.courseDistribution
          || !parsedContent.body.content.courseDistribution.table) {

        parsedContent.body.content.courseDistribution = {
          title: 'Course Distribution',
          description: '',
          table: {
            headers: ['Domain', 'Delivery Method', 'Hours', 'Credits'],
            /* 4 starter empty rows */
            rows: [
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', ''],
              ['', '', '', '']
            ]
          }
        };
        }
    
        // Inject default Course-Schedule if missing
        if (
          !parsedContent.body.content.courseSchedule ||
          !parsedContent.body.content.courseSchedule.weeks
        ) {
          parsedContent.body.content.courseSchedule = {
            title: 'Course Schedule',
            description: '',
            weeks: [
              {
                week: 1,
                module: '',
                // learningOutcomes: '',
                learningOutcomes: [{ outcome: '', clo: '' }],
                deliveryMethods: [
                  {
                    day: '',
                    methods: [{ method: '', duration: '' }]
                  }
                ],
                assignments: '',
                assessment: ''
              }
            ]
          }
        }

        // 🩹 Inject default empty table for learningOutcomes if missing
        if (!parsedContent.body.content.learningOutcomes.table && !parsedContent.body.content.learningOutcomes.description) {
          parsedContent.body.content.learningOutcomes.table = {
            headers: ['PLO', 'Learning Outcome'],
            rows: [['', '']]
          }
        }
  
        setContent(parsedContent)
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error)
      enqueueSnackbar('Failed to fetch syllabus', { variant: 'error' })
    }
  }
    

  const handleContentChange = (field, value) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent }
      const fields = field.split('.')
      let current = newContent
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {}
        }
        current = current[fields[i]]
      }
      current[fields[fields.length - 1]] = value
      return newContent
    })
  }

  const addSection = () => {
    setCurrentSection({
      title: '',
      description: '',
      table: null
    })
    setCurrentSectionKey(null)
    setOpenDialog(true)
  }

  const editSection = (key) => {
    setCurrentSection({ ...content.body.content[key] })
    setCurrentSectionKey(key)
    setOpenDialog(true)
  }

  const deleteSection = (key) => {
    if (key === 'instructorInfo') {
      enqueueSnackbar('Instructor Information section cannot be deleted', {
        variant: 'warning'
      })
      return
    }

    setContent((prevContent) => {
      const newContent = structuredClone(prevContent)
      delete newContent.body.content[key]
      return newContent
    })
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setCurrentSection(null)
    setCurrentSectionKey(null)
  }

  const handleDialogSave = () => {
    if (currentSection) {
      const newContent = { ...content }
      const sectionKey = currentSectionKey || `section_${Date.now()}`
      if (!newContent.body.content) {
        newContent.body.content = {}
      }
      newContent.body.content[sectionKey] = {
        title: currentSection.title,
        description: currentSection.description || '',
        table: currentSection.table || null
      }

      setContent(newContent)
      setOpenDialog(false)
      setCurrentSection(null)
      setCurrentSectionKey(null)
    }
  }

  const addRow = useCallback((sectionKey) => {
    setContent((prevContent) => {
      const newContent = structuredClone(prevContent)
      const section = newContent.body.content[sectionKey]

      if (!section?.table?.rows) return prevContent

      const newRow = Array(section.table.headers.length).fill('')
      section.table.rows = [...section.table.rows, newRow]

      return newContent
    })
  }, [])

  const deleteRow = useCallback((sectionKey, rowIndex) => {
    setContent((prevContent) => {
      const newContent = structuredClone(prevContent)
      const section = newContent.body.content[sectionKey]

      if (!section?.table?.rows || rowIndex < 0) return prevContent

      section.table.rows = section.table.rows.filter(
        (_, index) => index !== rowIndex
      )

      return newContent
    })
  }, [])

  const addColumn = useCallback((sectionKey) => {
    setContent((prevContent) => {
      const newContent = structuredClone(prevContent)
      const section = newContent.body.content[sectionKey]

      if (!section?.table) return prevContent

      section.table.headers = [...section.table.headers, '']
      section.table.rows = section.table.rows.map((row) => [...row, ''])

      return newContent
    })
  }, [])

  const deleteColumn = useCallback((sectionKey) => {
    setContent((prevContent) => {
      const newContent = structuredClone(prevContent)
      const section = newContent.body.content[sectionKey]

      if (!section?.table || section.table.headers.length <= 1) {
        return prevContent
      }

      section.table.headers = section.table.headers.slice(0, -1)
      section.table.rows = section.table.rows.map((row) => row.slice(0, -1))

      return newContent
    })
  }, [])

  const handleTableCellChange = useCallback(
    (sectionKey, rowIndex, cellIndex, value) => {
      setContent((prevContent) => {
        const newContent = { ...prevContent }
        const section = newContent.body.content[sectionKey]

        if (!section || !section.table) return newContent

        const newRows = [...section.table.rows]
        newRows[rowIndex] = [...newRows[rowIndex]]
        newRows[rowIndex][cellIndex] = value

        section.table.rows = newRows
        return newContent
      })
    },
    []
  )

  // store total hour of course schdule
  // const getCourseScheduleTotalHours = () => {
  //   const weeks = content?.body?.content?.courseSchedule?.weeks || []
  //   let total = 0
  
  //   for (const week of weeks) {
  //     const deliveryMethods = week.deliveryMethods || []
  //     for (const method of deliveryMethods) {
  //       const duration = parseFloat(method.duration)
  //       if (!isNaN(duration)) {
  //         total += duration
  //       }
  //     }
  //   }
  
  //   return total
  // }
  // set total hour of course schedule total duration
  const getCourseScheduleTotalHours = () => {
    const weeks = content?.body?.content?.courseSchedule?.weeks || []
    let total = 0
  
    for (const week of weeks) {
      const deliveryMethods = week.deliveryMethods || []
      for (const delivery of deliveryMethods) {
        const methods = delivery.methods || []
        for (const method of methods) {
          // method.duration might be a string like "1h", "30m", "1.5h"
          // So we parse and convert to hours:
  
          const durStr = method.duration?.toLowerCase()?.trim() || ''
  
          if (!durStr) continue
  
          let hours = 0
  
          if (durStr.endsWith('h')) {
            // e.g. "1.5h" or "1h"
            hours = parseFloat(durStr.replace('h', ''))
          } else if (durStr.endsWith('m')) {
            // e.g. "30m"
            const minutes = parseFloat(durStr.replace('m', ''))
            hours = minutes / 60
          } else {
            // fallback, try parse directly
            hours = parseFloat(durStr)
          }
  
          if (!isNaN(hours)) {
            total += hours
          }
        }
      }
    }
  
    // Round to 2 decimal places for neatness
    return Math.round(total * 100) / 100
  }
  
  const handleTableHeaderChange = useCallback((sectionKey, index, value) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent }
      const section = newContent.body.content[sectionKey]

      if (!section || !section.table) return newContent

      const newHeaders = [...section.table.headers]
      newHeaders[index] = value

      section.table.headers = newHeaders
      return newContent
    })
  }, [])


  const renderTableSection = (section, sectionKey) => {
    const headers = section.table.headers
    const rows = section.table.rows

    // Get column indexes
    const hourIndex = headers.findIndex(h => h.toLowerCase().includes('hour'))
    const creditIndex = headers.findIndex(h => h.toLowerCase().includes('credit'))

    const getColumnSum = (colIndex) => {
      return rows.reduce((acc, row) => {
        const val = parseFloat(row[colIndex])
        return acc + (isNaN(val) ? 0 : val)
      }, 0)
    }

    const totalRow = headers.map((_, idx) => {
      if (idx === 0) return 'Total'
      if (idx === hourIndex) return `${getColumnSum(hourIndex)}h`
      if (idx === creditIndex) return `${getColumnSum(creditIndex)} credit`
      return ''
    })

    return (
      <div className="space-y-4">
        <Table>
          {sectionKey !== 'learningOutcomes' && (
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>
                    <TextField
                      value={header}
                      onChange={(e) =>
                        handleTableHeaderChange(sectionKey, index, e.target.value)
                      }
                      fullWidth
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => addColumn(sectionKey)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <TextField
                      value={cell}
                      onChange={(e) =>
                        handleTableCellChange(
                          sectionKey,
                          rowIndex,
                          cellIndex,
                          e.target.value
                        )
                      }
                      fullWidth
                      multiline={(sectionKey === 'coursePolicies' && cellIndex === 1) ||
                        (sectionKey === 'courseDistribution' && cellIndex === 1)}
                      minRows={(sectionKey === 'coursePolicies' && cellIndex === 1) ? 2 :
                        (sectionKey === 'courseDistribution' && cellIndex === 1) ? 3 : 1}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => deleteRow(sectionKey, rowIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                {sectionKey === 'learningOutcomes' && (
                  <TableCell>
                    <IconButton onClick={() => addColumn(sectionKey)}>
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* ---- Total row (non-editable) ---- */}
            {sectionKey === 'courseDistribution' && (
              <TableRow>
                {totalRow.map((cell, i) => (
                  <TableCell key={i} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                    {cell}
                  </TableCell>
                ))}
                <TableCell /> {/* for delete button column */}
              </TableRow>
            )}
          </TableBody>
        </Table>
                  
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => addRow(sectionKey)}>Add Row</Button>
          <Button onClick={() => deleteColumn(sectionKey)} sx={{ ml: 2 }}>
            Delete Last Column
          </Button>
        </Box>
      </div>
    )
  }

  // renderSectionContent v2
  const renderSectionContent = (section, sectionKey) => {
    if (sectionKey === 'courseSchedule') {
      return renderStructuredCourseSchedule(sectionKey)
    } else if (sectionKey === 'courseDistribution' && section.table) {
      return renderTableSection(section, sectionKey)
    } else if (section.table) {
      return renderTableSection(section, sectionKey)
    } else {
      return (
        <ReactQuill
          value={section.description}
          onChange={(value) =>
            handleContentChange(`body.content.${sectionKey}.description`, value)
          }
        />
      )
    }
  }
  const renderCourseDistributionWithTotal = (section, sectionKey) => {
    const { headers, rows } = section.table || { headers: [], rows: [] }
  
    const getColumnSum = (colIndex) => {
      return rows.reduce((acc, row) => {
        const val = parseFloat(row[colIndex])
        return acc + (isNaN(val) ? 0 : val)
      }, 0)
    }
  
    const hourIndex = headers.findIndex(h => h.toLowerCase().includes('hour'))
    const creditIndex = headers.findIndex(h => h.toLowerCase().includes('credit'))
  
    const totalHours = hourIndex !== -1 ? getColumnSum(hourIndex) : 0
    const totalCredits = creditIndex !== -1 ? getColumnSum(creditIndex) : 0
  
    const totalRow = headers.map((_, idx) => {
      // Update total hours globally when rendering 'courseDistribution'
      if (sectionKey === 'courseDistribution' && hourIndex !== -1) {
        const totalHours = getColumnSum(hourIndex)
        setCourseDistributionTotalHours(totalHours)
      }
      if (idx === 0) return 'Total'
      if (idx === hourIndex) return `${totalHours}h`
      if (idx === creditIndex) return `${totalCredits} credit`
      return ''
    })
  
    return (
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell key={i}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            {totalRow.map((cell, i) => (
              <TableCell key={i} sx={{ fontWeight: 'bold' }}>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    )
  }
  

  const handleRenderPDF = async () => {
    try {
      const response = await axios.post('/syllabus/render-custom', {
        content: JSON.stringify(content)
      })

      if (response.data && response.data.pdf) {
        setPdfPreview(`data:application/pdf;base64,${response.data.pdf}`)
      } else {
        enqueueSnackbar('Failed to generate PDF preview', { variant: 'error' })
      }
    } catch (error) {
      console.error('Error rendering PDF:', error)
      enqueueSnackbar('Error rendering PDF: ' + error.message, {
        variant: 'error'
      })
    }
  }

  const handleSave = async () => {
    // Example: check if total hours from schedule matches distribution total hours
    if (courseScheduleTotalHours < courseDistributionTotalHours) {
      enqueueSnackbar(
        `Warning: Total schedule hours (${courseScheduleTotalHours}h) do not match course distribution hours (${courseDistributionTotalHours}h). Please fix before saving.`,
        { variant: 'error' }
      )
      return // stop save if validation fails
    }
  
    try {
      await axios.put(`/syllabus/save/${id}`, {
        content: JSON.stringify(content)
      })
      enqueueSnackbar('Syllabus saved successfully', { variant: 'success' })
    } catch (error) {
      console.error('Error saving syllabus:', error)
      enqueueSnackbar('Failed to save syllabus', { variant: 'error' })
    }
  }
  

  console.log("ALL SECTIONS KEYS:", Object.keys(content?.body?.content || {}))

  // add this to add a copy week 
  // ------------------------------------------------------------------
  // Structured week 1 copy and paste in week 2
  // ------------------------------------------------------------------

  const copyWeek = (w, setContent) => {
    setContent(prev => {
      const copy = structuredClone(prev);
      const weeks = copy.body.content.courseSchedule.weeks;
      const newWeek = structuredClone(weeks[w]);
  
      // Bump the week number
      newWeek.week = weeks.length + 1;
  
      // Optional: reset some fields
      // newWeek.learningOutcomes = '';
      // newWeek.assignments = '';
      // newWeek.assessment = '';
  
      weeks.push(newWeek);
      return copy;
    });
  };


  const renderStructuredCourseSchedule = (sectionKey) => {
    const section = content?.body?.content?.[sectionKey]
    if (!section || !section.weeks) return null

    /* ---------- tiny helpers ---------- */
    const patch = (cb) =>
      setContent((prev) => {
        const copy = structuredClone(prev)
        cb(copy)
        return copy
      })
   
    const addWeek = () =>
      patch((c) => {
        const newWeek = {
          week: c.body.content[sectionKey].weeks.length + 1,
          module: '',
          learningOutcomes: [
            {
              ol: '',
              clo: ''
            }
          ],
          deliveryMethods: [
            {
              day: '',
              methods: [
                {
                  method: '',
                  duration: ''
                }
              ]
            }
          ],
          assignments: '',
          assessment: ''
        }
    
        c.body.content[sectionKey].weeks.push(newWeek)
    })
    const deleteWeek = (weekIndex) =>
    patch((c) => {
      c.body.content[sectionKey].weeks.splice(weekIndex, 1);
      // Optional: Renumber weeks after deletion
      c.body.content[sectionKey].weeks.forEach((w, i) => {
        w.week = i + 1;
      });
    });

    const addDay = (w) =>
      patch((c) =>
        c.body.content[sectionKey].weeks[w].deliveryMethods.push({
          day: '',
          methods: []
        })
      )

    const addMethod = (w, d) =>
      patch((c) =>
        c.body.content[sectionKey].weeks[w].deliveryMethods[d].methods.push({
          method: '',
          duration: ''
        })
      )

    const setWeekField = (w, field, val) =>
      patch((c) => (c.body.content[sectionKey].weeks[w][field] = val))

    const setMethodField = (w, d, m, field, val) =>
      patch(
        (c) =>
          (c.body.content[sectionKey].weeks[w].deliveryMethods[d].methods[m][
            field
          ] = val)
      )
    
    // Made change for learning out come part to have 2 col -v2
    const addLearningOutcome = (w) =>
      patch((c) => {
        const targetWeek = c.body.content[sectionKey].weeks[w];
    
        if (!Array.isArray(targetWeek.learningOutcomes)) {
          targetWeek.learningOutcomes = [];
        }
    
        targetWeek.learningOutcomes.push({
          outcome: '',
          clo: '',
        });
      });
    
    const updateLearningOutcome = (w, i, field, value) =>
      patch((c) => {
        c.body.content[sectionKey].weeks[w].learningOutcomes[i][field] = value
      })
    
    const removeLearningOutcome = (w, i) =>
      patch((c) =>
        c.body.content[sectionKey].weeks[w].learningOutcomes.splice(i, 1)
      )
    
    /* ---------- render ---------- */
    return (
      <Box sx={{ mt: 2 }}>
        {section.weeks.map((week, w) => (
          <Paper key={w} sx={{ border: '1px solid #ccc', p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Sessions"
                  fullWidth
                  value={week.week}
                  onChange={(e) => setWeekField(w, 'week', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  label="Module / Chapter"
                  fullWidth
                  value={week.module}
                  onChange={(e) => setWeekField(w, 'module', e.target.value)}
                />
              </Grid>


              {/* Learning Outcome  v2 */} 
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Learning Outcomes
                </Typography>

                {/* {week.learningOutcomes?.map((lo, i) => ( */}
                {Array.isArray(week.learningOutcomes) ? week.learningOutcomes.map((lo, i) => (
                  <Grid container spacing={2} key={i} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <TextField
                        label=" Learning Outcome"
                        fullWidth
                        value={lo.outcome}
                        onChange={(e) =>
                          updateLearningOutcome(w, i, 'outcome', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        label="CLO"
                        fullWidth
                        value={lo.clo}
                        onChange={(e) =>
                          updateLearningOutcome(w, i, 'clo', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={1}>
                      {i > 0 && (
                        <Button
                          color="error"
                          onClick={() => removeLearningOutcome(w, i)}
                        >
                          ✕
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                )) : null}

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => addLearningOutcome(w)}
                >
                  + Add Learning Outcome
                </Button>
              </Grid>

              {/* Delivery-Method block */}
              <Grid item xs={12}>
                {week.deliveryMethods.map((day, d) => (
                  <Box
                    key={d}
                    sx={{ borderLeft: '3px solid #888', pl: 2, mb: 2 }}
                  >
                    <TextField
                      label="Day"
                      fullWidth
                      sx={{ mb: 1 }}
                      value={day.day}
                      onChange={(e) =>
                        patch(
                          (c) =>
                            (c.body.content[sectionKey].weeks[w]
                              .deliveryMethods[d].day = e.target.value)
                        )
                      }
                    />
                    {day.methods.map((mth, m) => (
                      <Grid container spacing={1} key={m} sx={{ mb: 1 }}>
                        <Grid item xs={7}>
                          <TextField
                            label="Method"
                            fullWidth
                            value={mth.method}
                            onChange={(e) =>
                              setMethodField(
                                w,
                                d,
                                m,
                                'method',
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            label="Duration"
                            fullWidth
                            value={mth.duration}
                            onChange={(e) =>
                              setMethodField(
                                w,
                                d,
                                m,
                                'duration',
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                      </Grid>
                    ))}

                    <Button
                      size="small"
                      onClick={() => addMethod(w, d)}
                      sx={{ mt: 0.5 }}
                    >
                      + Add Method
                    </Button>
                  </Box>
                ))}


              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assignments / Reading"
                  fullWidth
                  value={week.assignments}
                  onChange={(e) =>
                    setWeekField(w, 'assignments', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Assessment"
                  fullWidth
                  value={week.assessment}
                  onChange={(e) =>
                    setWeekField(w, 'assessment', e.target.value)
                  }
                />
              </Grid>
              <Button
                  size="small"
                  color="secondary"
                  onClick={() => copyWeek(w, setContent)}
                  sx={{ mt: 1 }}
                >
                  ⧉ Duplicate This Session
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this session?')) {
                      deleteWeek(w); // <-- w must be in scope here
                    }
                  }}
                  sx={{ mt: 1, ml: 1 }}
                >
                  X Delete This Session
                </Button>
            </Grid>
          </Paper>
        ))}

        <Button onClick={addWeek} variant="contained">
          + Add Session
          
        </Button>
        
      
      </Box>
    )
  }

  return (
    <Page title="Edit Syllabus">
      <Container maxWidth={false} disableGutters>
        <HeaderBreadcrumbs
          heading={`Edit Syllabus: ${content?.head?.title || ''}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Syllabus Listing', href: PATH_DASHBOARD.syllabus.list },
            { name: 'Edit' }
          ]}
        />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Course Information
              </Typography>
              <TextField
                fullWidth
                label="Course Code"
                value={content?.body?.header?.courseInfo?.courseCode || ''}
                onChange={(e) =>
                  handleContentChange(
                    'body.header.courseInfo.courseCode',
                    e.target.value
                  )
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Academic Year"
                value={content?.body?.header?.courseInfo?.academicYear || ''}
                onChange={(e) =>
                  handleContentChange(
                    'body.header.courseInfo.academicYear',
                    e.target.value
                  )
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Semester"
                value={content?.body?.header?.courseInfo?.semester || ''}
                onChange={(e) =>
                  handleContentChange(
                    'body.header.courseInfo.semester',
                    e.target.value
                  )
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Credits"
                value={content?.body?.header?.courseInfo?.credits || ''}
                onChange={(e) =>
                  handleContentChange(
                    'body.header.courseInfo.credits',
                    e.target.value
                  )
                }
                sx={{ mb: 2 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Syllabus Content
              </Typography>
              {Object.entries(content?.body?.content || {})
                .sort(([keyA], [keyB]) => {
                  const order = [
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
                  ]
                  const indexA = order.indexOf(keyA)
                  const indexB = order.indexOf(keyB)
                  if (indexA === -1 && indexB === -1) {
                    // If both keys are not in the order array, sort them by their keys
                    return keyA.localeCompare(keyB)
                  }
                  if (indexA === -1) return 1 // New items (not in order) go to the end
                  if (indexB === -1) return -1 // New items (not in order) go to the end
                  return indexA - indexB // Existing items maintain their order
                })
                .map(([key, section]) => (
                  <Box key={key} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {section.title}
                    </Typography>
                    {renderSectionContent(section, key)}
                    {key !== 'courseSchedule' && (
                    <Box sx={{ mt: 1 }}>
                      <IconButton onClick={() => editSection(key)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteSection(key)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    )}
                  </Box>
                ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addSection}
                sx={{ mt: 2 }}
              >
                Add New Section
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSave}>
                Save Syllabus
              </Button>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={handleRenderPDF}
              >
                Preview
              </Button>
            </Box>
          </Grid>
          
        </Grid>
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {currentSectionKey ? 'Edit Section' : 'Add Section'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Section Title"
              value={currentSection?.title || ''}
              onChange={(e) =>
                setCurrentSection({ ...currentSection, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Section Type"
              value={currentSection?.table ? 'table' : 'text'}
              onChange={(e) => {
                const newSection = { ...currentSection }
                if (e.target.value === 'table') {
                  newSection.table = { headers: [''], rows: [['']] }
                  newSection.description = ''
                } else {
                  newSection.table = null
                  newSection.description = ''
                }
                setCurrentSection(newSection)
              }}
              sx={{ mb: 2 }}
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="table">Table</MenuItem>
            </TextField>
            {!currentSection?.table && (
              <ReactQuill
                value={currentSection?.description || ''}
                onChange={(value) =>
                  setCurrentSection({ ...currentSection, description: value })
                }
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleDialogSave}>Save</Button>
          </DialogActions>
        </Dialog>
        {pdfPreview && (
          <Box mt={4} sx={{ width: '100%' }}>
            <Typography variant="h6" mb={2}>
              PDF Preview
            </Typography>
            <Paper
              elevation={3}
              sx={{
                height: '70vh',
                width: '100%',
                overflow: 'hidden'
              }}
            >
              <embed
                src={pdfPreview}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </Paper>
          </Box>
        )}
      </Container>
    </Page>
  )
}
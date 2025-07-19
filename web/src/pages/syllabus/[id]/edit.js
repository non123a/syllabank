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
  const fetchSyllabus = async () => {
    try {
      const response = await axios.get(`/syllabus/${id}`)
      if (response.data) {
        const parsedContent = JSON.parse(response.data.content)
        console.log("🔎 FETCHED SYLLABUS:", parsedContent)
        // console.log(content.body.content.courseSchedule)

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



        if (query.sections && (!courseInfo.credits || courseInfo.credits.includes('Credits X'))) {

          try {

            const parsedSections = JSON.parse(query.sections)

            if (Array.isArray(parsedSections)) {

              courseInfo.credits = `Credits: ${parsedSections[0]}`

            }

          } catch (err) {

            console.warn('Could not parse sections', err)

          }

        }

    

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





        // ✅ Finally update state

        // setContent(parsedContent)


        // add course distribution
        if (!parsedContent.body.content.courseDistribution) {
          parsedContent.body.content.courseDistribution = {
            title: 'Course Distribution',
            description: '',
            table: { headers: ['Domain','Delivery Method','Topic', 'Hours'], rows: [['', '','','']] }
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
    return (
      <div className="space-y-4">
        <Table>
        {sectionKey !== 'learningOutcomes' && (
            <TableHead>
              <TableRow>
                {section.table.headers.map((header, index) => (
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
            {section.table.rows.map((row, rowIndex) => (
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
                {sectionKey == 'learningOutcomes' && (
                <TableCell>
                  <IconButton onClick={() => addColumn(sectionKey)}>
                    <AddIcon />
                  </IconButton>
                </TableCell>
                )}
              </TableRow>
            ))}
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
  
//  change here check if the table is course schedule then generaet a unique table for it
  const renderSectionContent = (section, sectionKey) => {
    if (sectionKey === 'courseSchedule') {
      return renderStructuredCourseSchedule(sectionKey)
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
  //   // 🔖 HELPER: duplicates a week and renumbers it
  // const copyLastWeek = (setContent) => {
  //   setContent(prev => {
  //     const draft = structuredClone(prev);
  //     const weeks = draft.body.content.courseSchedule.weeks;
  //     if (!weeks.length) return prev;   // nothing to copy

  //     const newWeek = structuredClone(weeks[weeks.length - 1]);
  //     newWeek.week = weeks.length + 1;  // bump label
  //     weeks.push(newWeek);
  //     return draft;
  //   });
  // };

  // add this to render a nested course schedule that custom made
  // ------------------------------------------------------------------
  // Structured Course Schedule (Weeks ▸ Days ▸ Methods)
  // ------------------------------------------------------------------

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
      patch((c) =>
        c.body.content[sectionKey].weeks.push({
          week: c.body.content[sectionKey].weeks.length + 1,
          module: '',
          learningOutcomes: '',
          
          deliveryMethods: [],
          assignments: '',
          assessment: ''
        })
      )

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
    // Made change for learning out come part to have 2 col -v1
    // const addLearningOutcome = (w) =>
    //   patch((c) =>
    //     c.body.content[sectionKey].weeks[w].learningOutcomes.push({
    //       outcome: '',
    //       clo: ''
    //     })
    //   )
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
              {/* Learning Outcome  v1 */} 
              {/* <Grid item xs={12}>
                <TextField
                  label="Learning Outcomes"
                  fullWidth
                  multiline
                  minRows={3}
                  value={week.learningOutcomes}
                  onChange={(e) =>
                    setWeekField(w, 'learningOutcomes', e.target.value)
                  }
                />
              
              </Grid> */}


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

                {/* <Button
                  size="small"
                  onClick={() => addDay(w)}
                  sx={{ mt: 1 }}
                  variant="outlined"
                >
                  + Add Day
                </Button> */}
                {/* this button add to allow user to copy the previous week to paste in the next week */}
                {/* <Button
                  size="small"
                  color="secondary"
                  onClick={() => copyWeek(w, setContent)}
                  sx={{ mt: 1 }}
                >
                  ⧉ Copy
                </Button> */}

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
            </Grid>
          </Paper>
        ))}

        <Button onClick={addWeek} variant="contained">
          + Add Session
          
        </Button>
        {/* add copy buttom */}
        {/* <Button
          variant="outlined"          // secondary style
          sx={{ ml: 1 }}              // small left-margin
          onClick={copyLastWeek}      // handler you already wrote
          title="Duplicate the last week with all its details"
        >
          ⧉ Copy
        </Button> */}
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
                    {/* {key !== 'courseSchedule' && ( */}
                    <Box sx={{ mt: 1 }}>
                      <IconButton onClick={() => editSection(key)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteSection(key)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    {/* )} */}
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
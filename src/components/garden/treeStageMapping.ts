
// Define the updated mapping between streak counts and tree stages
const getUpdatedTreeStage = (streakCount: number): string => {
  const stageImages = {
    stage1: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-1.png',
    stage2: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-2.png',
    stage3: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-3.png',
    stage4: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-4.png',
    stage5: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-5.png',
    stage6: 'https://sakeurhfemssebptfycs.supabase.co/storage/v1/object/public/tree-imgs//tree-stage-6.png',
  };
  
  if (streakCount <= 1) return stageImages.stage1;     // 0-1 days
  if (streakCount <= 3) return stageImages.stage2;     // 2-3 days
  if (streakCount <= 6) return stageImages.stage3;     // 4-6 days
  if (streakCount <= 13) return stageImages.stage4;    // 7-13 days
  if (streakCount <= 29) return stageImages.stage5;    // 14-29 days
  return stageImages.stage6;                          // 30+ days
};

export { getUpdatedTreeStage };
